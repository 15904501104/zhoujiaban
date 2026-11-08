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
          date: "2008.05.15",
          badge: "副创始人",
          bio: "将军落幕后曾带领驰家军\n身体素质通过国家飞行员体检\n最压抑之人\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-zhu.webp?v=1"
        },
        {
          name: "王源泉",
          date: "2008.07.06",
          title: "金牌打手",
          bio: "原吕家军二把手\n成员中运动天赋最高，身体素质极好\n曾在【任务】中担任毒师（{{被逮捕}}）\n日常【任务】中第一输出\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-wang.webp?v=1"
        },
        {
          name: "张昊",
          date: "2008.03.27",
          title: "金牌打手",
          bio: "原吕家军成员\n在家能掌管上千只🐔，胆大\n拿下【任务】中一血\n【任务】中曾使龙哥嘴角流血\n【任务】出场频率最高\n肘家班元老级成员",
          photo: "member-zhanghao.webp?v=1"
        },
        {
          name: "张桓",
          date: "2008.05.14",
          badge: "秘书",
          bio: "原吕家军成员\n心思细腻\n内蒙古第一语言输出\n曾在群内通过语言输出\n解决了肘家班最大的隐患\n直接促成了今天的肘家班\n【任务】出场率中等\n肘家班元老级成员",
          photo: "member-zhanghuan.webp?v=1"
        },
        {
          name: "王者禹",
          date: "2008.04.13",
          bio: "原中立派\n呼兰大侠老乡\n肘家班块头最大之人\n曾协助张桓解决团队隐患\n【任务】出场率中等\n肘家班元老级成员",
          photo: "member-wangzy.webp?v=1"
        }

      ];

      const list = document.getElementById("member-list");
      members.forEach((person) => {
        const li = document.createElement("li");

        if (person.photo) {
          const img = document.createElement("img");
          img.className = "photo";
          img.src = person.photo;
          img.alt = person.name;
          img.width = 800;
          img.height = 1062;
          img.loading = "lazy";
          img.decoding = "async";
          li.appendChild(img);
        } else {
          const ph = document.createElement("div");
          ph.className = "photo blank";
          ph.textContent = "照片待补";
          li.appendChild(ph);
        }

        const meta = document.createElement("div");
        meta.className = "member-meta";

        const h = document.createElement("h3");
        h.className = "member-name";
        h.textContent = person.name;
        if (person.badge) {
          const badge = document.createElement("span");
          badge.className = "member-tag blue";
          badge.textContent = person.badge;
          h.appendChild(badge);
        }
        if (person.title) {
          const tag = document.createElement("span");
          tag.className = "member-tag";
          tag.textContent = person.title;
          h.appendChild(tag);
        }

        const p = document.createElement("p");
        p.className = "member-bio";

        const appendInline = (text, parent) => {
          let rest = text;
          while (rest.length) {
            const open = rest.indexOf("{{");
            if (open < 0) {
              parent.appendChild(document.createTextNode(rest));
              return;
            }
            if (open > 0) parent.appendChild(document.createTextNode(rest.slice(0, open)));
            const close = rest.indexOf("}}", open + 2);
            if (close < 0) {
              parent.appendChild(document.createTextNode(rest.slice(open)));
              return;
            }
            const mark = document.createElement("span");
            mark.className = "red";
            mark.textContent = rest.slice(open + 2, close);
            parent.appendChild(mark);
            rest = rest.slice(close + 2);
          }
        };

        person.bio.split("\n").forEach((line, i) => {
          if (i) p.appendChild(document.createElement("br"));
          const lineEl = document.createElement("span");
          if (line === "金牌打手") lineEl.className = "gold";
          appendInline(line, lineEl);
          p.appendChild(lineEl);
        });

        meta.appendChild(h);
        meta.appendChild(p);
        if (person.date) {
          const dateEl = document.createElement("span");
          dateEl.className = "member-date";
          dateEl.textContent = person.date;
          meta.appendChild(dateEl);
        }
        li.appendChild(meta);
        list.appendChild(li);
      });

      
console.log(members.map((m) => m.name + ' ' + m.date).join(String.fromCharCode(10)));
