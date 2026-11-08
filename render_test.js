function El(tag){ this.tagName = tag; this.children = []; this.className = ""; this.textContent = ""; this.src=""; this.alt=""; this.width=0; this.height=0; this.loading=""; this.decoding=""; }
El.prototype.appendChild = function(c){ this.children.push(c); return c; };
const doc = { createElement: (t) => new El(t), createTextNode: (t) => ({ text: t }), getElementById: (id) => new El("ul") };
const members = [
        {
          name: "吕奥",
          date: "2008.08.10",
          title: "金牌打手",
          badge: "创始人",
          bio: "将军落幕后曾带领吕家军\n龙哥大哥最严厉的父亲\n【任务】出场频率最高\n肘家班创始人\n肘家班元老级成员",
          photo: "member-lvao.webp?v=3"
        },
        {
          name: "朱星驰",
          badge: "副创始人",
          bio: "将军落幕后曾带领驰家军\n身体素质通过国家飞行员体检\n最压抑之人\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-zhu.webp?v=1"
        },
        {
          name: "王源泉",
          title: "金牌打手",
          bio: "原吕家军二把手\n成员中运动天赋最高，身体素质极好\n曾在【任务】中担任毒师（{{被逮捕}}）\n日常【任务】中第一输出\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-wang.webp?v=1"
        },
        {
          name: "张昊",
          title: "金牌打手",
          bio: "原吕家军成员\n在家能掌管上千只🐔，胆大\n拿下【任务】中一血\n【任务】中曾使龙哥嘴角流血\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-zhanghao.webp?v=1"
        },
        {
          name: "张桓",
          badge: "秘书",
          bio: "原吕家军成员\n心思细腻\n内蒙古第一语言输出\n曾在群内通过语言输出\n解决了肘家班最大的隐患\n直接促成了今天的肘家班\n【任务】出场率中等\n肘家班元老级成员",
          photo: "member-zhanghuan.webp?v=1"
        },
        {
          name: "王者禹",
          bio: "原中立派\n呼兰大侠老乡\n肘家班块头最大之人\n曾协助张桓解决团队隐患\n【任务】出场率中等\n肘家班元老级成员",
          photo: "member-wangzy.webp?v=1"
        }

      ];

      const list = doc.getElementById("member-list");
      members.forEach((person) => {
        const li = doc.createElement("li");

        if (person.photo) {
          const img = doc.createElement("img");
          img.className = "photo";
          img.src = person.photo;
          img.alt = person.name;
          img.width = 800;
          img.height = 1062;
          img.loading = "lazy";
          img.decoding = "async";
          li.appendChild(img);
        } else {
          const ph = doc.createElement("div");
          ph.className = "photo blank";
          ph.textContent = "照片待补";
          li.appendChild(ph);
        }

        const meta = doc.createElement("div");
        meta.className = "member-meta";

        const h = doc.createElement("h3");
        h.className = "member-name";
        h.textContent = person.name;
        if (person.badge) {
          const badge = doc.createElement("span");
          badge.className = "member-tag blue";
          badge.textContent = person.badge;
          h.appendChild(badge);
        }
        if (person.title) {
          const tag = doc.createElement("span");
          tag.className = "member-tag";
          tag.textContent = person.title;
          h.appendChild(tag);
        }

        const p = doc.createElement("p");
        p.className = "member-bio";

        const appendInline = (text, parent) => {
          let rest = text;
          while (rest.length) {
            const open = rest.indexOf("{{");
            if (open < 0) {
              parent.appendChild(doc.createTextNode(rest));
              return;
            }
            if (open > 0) parent.appendChild(doc.createTextNode(rest.slice(0, open)));
            const close = rest.indexOf("}}", open + 2);
            if (close < 0) {
              parent.appendChild(doc.createTextNode(rest.slice(open)));
              return;
            }
            const mark = doc.createElement("span");
            mark.className = "red";
            mark.textContent = rest.slice(open + 2, close);
            parent.appendChild(mark);
            rest = rest.slice(close + 2);
          }
        };

        person.bio.split("\n").forEach((line, i) => {
          if (i) p.appendChild(doc.createElement("br"));
          const lineEl = doc.createElement("span");
          if (line === "金牌打手") lineEl.className = "gold";
          appendInline(line, lineEl);
          p.appendChild(lineEl);
        });

        const head = doc.createElement("div");
        head.className = "member-head";
        head.appendChild(h);
        if (person.date) {
          const dateEl = doc.createElement("span");
          dateEl.className = "member-date";
          dateEl.textContent = person.date;
          head.appendChild(dateEl);
        }

        meta.appendChild(head);
        meta.appendChild(p);
        li.appendChild(meta);
        list.appendChild(li);
      });

      

const SEP = String.fromCharCode(10);
const rows = [];
list.children.forEach((li) => {
  if (li.className === "todo") return;
  const meta = li.children[1];
  const head = meta.children[0];
  const name = head.children[0];
  const date = head.children[1];
  rows.push(name.textContent + (date ? "  右上角: " + date.textContent : ""));
});
console.log(rows.join(SEP));
