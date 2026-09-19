#!/usr/bin/env python3
"""Generate Jekyll layout + page wrappers so GitHub Pages builds the site natively.

GitHub Pages runs Jekyll on every push, so no CI workflow is needed:
- _layouts/default.html  : shared head / domain bar / header / footer
- <page>.html (root)     : tiny wrapper = front matter + include of src/pages/<page>.html
- guide-*.html (root)    : wrapper = front matter + article template + include of src/articles/*
Run after editing sources:  python3 build.py && python3 gen_jekyll.py
"""
import json, re, pathlib, datetime
import build as B

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "_jekyll_out"


def yq(s):
    return json.dumps(s, ensure_ascii=False)  # JSON strings are valid YAML double-quoted scalars


MENU = "".join(
    '<li><a href="%s"{%% if page.nav == "%s" %%} aria-current="page"{%% endif %%}>%s</a></li>' % (h, k, l)
    for h, l, k in B.NAV)

JSONLD = ('{% if page.article %}{"@context": "https://schema.org", "@type": "Article", "headline": {{ page.h1 | jsonify }}, '
          '"description": {{ page.desc | jsonify }}, "datePublished": "{{ site.time | date: "%Y-%m-%d" }}", '
          '"dateModified": "{{ site.time | date: "%Y-%m-%d" }}", "author": {"@type": "Organization", "name": "Life.Studio Editorial"}, '
          '"publisher": {"@type": "Organization", "name": "Life.Studio"}, "mainEntityOfPage": "{{ site.siteurl }}{{ page.url }}"}'
          '{% else %}{"@context": "https://schema.org", "@type": "{% if page.url == "/" %}WebSite{% else %}WebPage{% endif %}", '
          '"name": {{ page.title | jsonify }}, "url": "{{ site.siteurl }}{{ page.url }}", "description": {{ page.desc | jsonify }}}{% endif %}')

SCRIPTS = '{% for s in page.scripts %}<script src="assets/js/{{ s }}.js"></script>\n{% endfor %}'


def layout():
    head = B.HEAD.format(title="{{ page.title }}", desc="{{ page.desc }}", url="{{ site.siteurl }}{{ page.url }}",
                         site="{{ site.siteurl }}", robots="{% if page.noindex %}noindex{% else %}index,follow{% endif %}",
                         ogtype="{% if page.article %}article{% else %}website{% endif %}", jsonld=JSONLD,
                         bodyattr="{% if page.nopopup %} data-no-popup{% endif %}", menu=MENU)
    return head + "{{ content }}" + B.FOOT.format(scripts=SCRIPTS)


def fm(d):
    lines = ["---"]
    for k, v in d.items():
        lines.append(f"{k}: {yq(v)}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def page_meta(path):
    raw = path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(\{.*?\})-->", raw, re.S)
    return json.loads(m.group(1))


def main():
    OUT.mkdir(exist_ok=True)
    (OUT / "_layouts").mkdir(exist_ok=True)
    (OUT / "_layouts/default.html").write_text(layout(), encoding="utf-8")
    files = {"_layouts/default.html": layout()}
    for p in sorted((ROOT / "src/pages").glob("*.html")):
        meta = page_meta(p)
        d = {"layout": "default", "title": meta["title"], "desc": meta["desc"], "nav": meta.get("nav", "")}
        if meta.get("scripts"): d["scripts"] = meta["scripts"]
        if meta.get("nopopup"): d["nopopup"] = True
        if p.name == "404.html": d["noindex"] = True; d["permalink"] = "/404.html"
        if p.name == "guides.html":
            body = re.sub(r"^\s*<!--\{.*?\}-->", "", p.read_text(encoding="utf-8"), flags=re.S)
            files[p.name] = fm(d) + body
        else:
            files[p.name] = fm(d) + ("{%% capture raw %%}{%% include_relative src/pages/%s %%}{%% endcapture %%}"
                                     "{%% assign head = raw | split: \"}-->\" | first %%}{{ raw | remove_first: head | remove_first: \"}-->\" }}\n" % p.name)
    arts = []
    for p in sorted((ROOT / "src/articles").glob("*.html")):
        first = p.read_text(encoding="utf-8").split("\n", 1)[0]
        arts.append((json.loads(first), p.name))
    tpl = re.sub(r"^<!--\{meta\}-->\n", "", B.ARTICLE)
    body = "{{ content }}"
    related = ('{% assign guides = site.pages | where: "article", true %}{% for g in guides %}{% if g.url != page.url %}'
               '<p><a href="{{ g.url | remove_first: \"/\" }}">{{ g.h1 }}</a></p>{% endif %}{% endfor %}')
    art = "---\nlayout: default\n---\n" + tpl.format(
        meta="", cat="{{ page.cat }}", title="{{ page.h1 }}", title_attr="{{ page.h1 | remove: '\"' }}", min="{{ page.min }}",
        updated="{{ site.time | date: \"%B %Y\" }}", body=body, tool_href="{{ page.tool_href }}",
        tool_label="{{ page.tool_label }}", related=related)
    files["_layouts/article.html"] = art
    for m, fname in arts:
        d = {"layout": "article", "title": f'{m["title"]} | Life.Studio', "h1": m["title"], "desc": m["desc"],
             "nav": "guides", "article": True, "cat": m["cat"], "min": m["min"], "tool_href": m["tool"][0],
             "tool_label": m["tool"][1]}
        files[m["slug"] + ".html"] = fm(d) + ("{%% capture raw %%}{%% include_relative src/articles/%s %%}{%% endcapture %%}"
            "{%% assign head = raw | split: \"]}\" | first %%}{{ raw | remove_first: head | remove_first: \"]}\" }}\n" % fname)
    for k, v in files.items():
        (OUT / k).parent.mkdir(parents=True, exist_ok=True)
        (OUT / k).write_text(v, encoding="utf-8")
    json.dump(sorted(files), open(OUT / "_files.json", "w"))
    print(len(files), "files")


if __name__ == "__main__":
    main()
