
      const MEMBER_TOTAL = 12;
      const members = [
        {
          name: "吕奥",
          date: "2008.08.10",
          title: "金牌打手",
          badge: "创始人",
          bio: "将军落幕后曾带领吕家军\n龙哥大哥最严厉的父亲\n擅长捆龙 驯龙 调教龙\n擅长发现问题，解决问题\n擅长团结成员 组织成员 胆大心细\n日常【任务】左右手[[张昊]] [[曹宇桓]]\n曾在【任务】中担任第二卧底\n【任务】出场频率最高\n肘家班创始人\n肘家班元老级成员",
          photo: "member-lvao.webp?v=3"
        },
        {
          name: "朱星驰",
          date: "2008.05.15",
          badge: "副创始人",
          bio: "将军落幕后曾带领驰家军\n身体素质通过国家飞行员体检\n最压抑之人\n擅长交友 联络\n被官方（{{逮捕}}）次数最多之人\n曾在【任务】中成为第一鸡蛋投手\n【任务】出场频率最高\n肘家班元老级成员",
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
          bio: "原中立派\n呼兰大侠老乡\n胆大沉稳　肘家班的默默砥柱\n肘家班块头最大之人\n曾协助张桓解决团队隐患\n【任务】中大多担任言语输出\n风格直击要害　侮辱性强\n【任务】出场率中等\n肘家班元老级成员",
          photo: "member-wangzy.webp?v=1"
        },
        {
          name: "曹宇桓",
          badge: "^(*￣(oo)￣)^",
          badgeTone: "pink",
          date: "2008.03.01",
          bio: "原吕家军成员　代号：猪\n头脑慢 可信度高 心理素质偏脆弱 胆小 听话\n日常做吕奥陪练　肘家班最厚肉盾\n曾在多次【任务】中做吕奥副手\n【任务】出场率偏高\n肘家班元老级成员",
          photo: "member-caoyh.webp?v=1"
        },
        {
          name: "郎宏泽",
          date: "2008.05.16",
          bio: "原驰家军成员　擅长语言输出\n风格偏低俗　侮辱　极具恶趣味　淫秽不堪\n淫商高　狡辩能力强\n执行力强，为人大方不爱计较\n酷爱装逼　胆小　擅求饶\n曾在【任务】中协助毒师王源泉（{{被逮捕}}）\n【任务】出场率偏高\n肘家班元老级成员",
          photo: "member-langhz.webp?v=1"
        },
        {
          name: "周佳聪",
          badge: "水果王",
          date: "2007.04.24",
          bio: "原中立派\n经典刀片头是最锋利的武器\n肘家班坦克驾驶员\n肘家班校内记录员\n曾在【任务】中找茬并诬陷大哥\n曾在【任务】中做第一卧底\n后续转到辽宁锦州未参与【任务】\n肘家班目前最成熟的男人\n肘家班元老级成员",
          photo: "member-zhoujc.webp?v=1"
        },
        {
          name: "王振蘅",
          date: "2007.12.24",
          badge: "(・ᴥ・)",
          badgeTone: "yellow",
          bio: "原吕家军成员　代号：狗\n方脸不是爱槟郎而是天生\n肘家班第一舔狗\n理科思维第一\n实力肘家班中垫底\n头脑聪明 心眼儿多但经不起怂恿与诱惑\n肘家班中唯一需要被团队保护的人\n日常【任务】中善于优先找茬\n【任务】出场率偏高\n肘家班元老级人物",
          photo: "member-wangzh.webp?v=1"
        },
        {
          name: "宋君昊",
          date: "2008.02.28",
          bio: "原驰家军成员\n肘家班潜水员\n日常生活说话幽默　忠于团队\n平时很少发表言论不参与任务\n默默无闻的电竞员　游戏水平高\n【任务】出场率低\n驰家军合并后由[[朱星驰]]带入肘家班",
          photo: "member-songjh.webp?v=1"
        },
        {
          name: "只海博",
          date: "2007.10.09",
          badgeImg: "badge-zhihb-white.png",
          badgeTone: "black",
          bio: "原中立派　代号：嘉豪，狗哥\n善良忠厚 朴实　肘家班金嗓子 唱歌一流\n肘家班最老实的人\n肘家班最豪的男人\n肘家班最善良的男人\n肘家班幕后保障\n善于给成员做心理疏导，安慰他人情绪\n总体乐观开朗\n【任务】出场率低\n为人忠厚　由[[周佳聪]]带入肘家班\n也是最后加入肘家班的成员",
          photo: "member-zhihb.webp?v=1"
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
        if (person.badgeImg) {
          const logo = document.createElement("span");
          logo.className = "member-tag svg-badge " + (person.badgeTone || "blue");
          const img = document.createElement("img");
          img.src = person.badgeImg;
          img.alt = person.name + "的标签";
          logo.appendChild(img);
          h.appendChild(logo);
        } else if (person.badgeSvg) {
          const logo = document.createElement("span");
          logo.className = "member-tag svg-badge " + (person.badgeTone || "blue");
          logo.innerHTML = person.badgeSvg;
          logo.setAttribute("aria-hidden", "true");
          h.appendChild(logo);
        } else if (person.badge) {
          const badge = document.createElement("span");
          badge.className = "member-tag " + (person.badgeTone || "blue");
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
            const redAt = rest.indexOf("{{");
            const linkAt = rest.indexOf("[[");
            if (redAt < 0 && linkAt < 0) {
              parent.appendChild(document.createTextNode(rest));
              return;
            }
            const isRed = redAt >= 0 && (linkAt < 0 || redAt < linkAt);
            const open = isRed ? redAt : linkAt;
            const closeToken = isRed ? "}}" : "]]";
            if (open > 0) parent.appendChild(document.createTextNode(rest.slice(0, open)));
            const close = rest.indexOf(closeToken, open + 2);
            if (close < 0) {
              parent.appendChild(document.createTextNode(rest.slice(open)));
              return;
            }
            const inner = rest.slice(open + 2, close);
            if (isRed) {
              const mark = document.createElement("span");
              mark.className = "red";
              mark.textContent = inner;
              parent.appendChild(mark);
            } else {
              const mate = members.find((item) => item.name === inner);
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "member-link";
              btn.textContent = inner;
              btn.setAttribute("aria-label", "查看" + inner + "的头像");
              if (mate && mate.photo) {
                btn.dataset.photo = mate.photo;
                btn.dataset.name = mate.name;
              }
              parent.appendChild(btn);
            }
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

      const remaining = Math.max(0, MEMBER_TOTAL - members.length);
      if (remaining > 0) {
        const todo = document.createElement("li");
        todo.className = "todo";
        const strong = document.createElement("strong");
        strong.textContent = "还有 " + remaining + " 位同学";
        const span = document.createElement("span");
        span.textContent = "姓名、一句话简介、照片，到齐了再填。";
        todo.appendChild(strong);
        todo.appendChild(span);
        list.appendChild(todo);
      }

      const avatarModal = document.getElementById("avatar-modal");
      if (avatarModal && list) {
        const avatarImg = avatarModal.querySelector("img");
        const avatarName = avatarModal.querySelector("p");
        let lastTrigger = null;

        const closeAvatar = () => {
          avatarModal.hidden = true;
          document.body.classList.remove("modal-open");
          if (lastTrigger) lastTrigger.focus();
        };

        list.addEventListener("click", (event) => {
          const trigger = event.target.closest(".member-link");
          if (!trigger || !trigger.dataset.photo) return;
          lastTrigger = trigger;
          avatarImg.src = trigger.dataset.photo;
          avatarImg.alt = (trigger.dataset.name || "") + " 的头像";
          avatarName.textContent = trigger.dataset.name || "";
          avatarModal.hidden = false;
          document.body.classList.add("modal-open");
        });

        avatarModal.addEventListener("click", (event) => {
          if (!event.target.closest(".avatar-box")) closeAvatar();
        });

        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && !avatarModal.hidden) closeAvatar();
        });
      }

      [
        { trigger: "idea-open", modal: "idea-modal", close: "idea-close" },
        { trigger: "apology-open", modal: "apology-modal", close: "apology-close" },
        { trigger: "concept-open", modal: "concept-modal", close: "concept-close" }
      ].forEach((cfg) => {
        const trigger = document.getElementById(cfg.trigger);
        const modal = document.getElementById(cfg.modal);
        const closeBtn = document.getElementById(cfg.close);
        if (!trigger || !modal) return;
        const open = () => {
          modal.hidden = false;
          document.body.classList.add("modal-open");
          if (closeBtn) closeBtn.focus();
        };
        const close = () => {
          modal.hidden = true;
          document.body.classList.remove("modal-open");
          trigger.focus({ preventScroll: true });
        };
        trigger.addEventListener("click", (event) => {
          event.preventDefault();
          open();
        });
        if (closeBtn) closeBtn.addEventListener("click", close);
        modal.addEventListener("click", (event) => {
          if (!event.target.closest(".sheet-box")) close();
        });
        document.addEventListener("keydown", (event) => {
          if (event.key !== "Escape" || modal.hidden) return;
          const zoom = document.getElementById("photo-modal");
          if (zoom && !zoom.hidden) return;
          close();
        });
      });

      const photoModal = document.getElementById("photo-modal");
      const photoModalImg = document.getElementById("photo-modal-img");
      if (photoModal && photoModalImg) {
        const closePhoto = () => {
          photoModal.hidden = true;
          photoModalImg.removeAttribute("src");
        };
        document.addEventListener("click", (event) => {
          const fig = event.target.closest(".sheet-figure img, .shot img");
          if (fig) {
            photoModalImg.src = fig.currentSrc || fig.src;
            photoModalImg.alt = fig.alt || "";
            photoModal.hidden = false;
            return;
          }
          if (!photoModal.hidden && !event.target.closest(".photo-modal img")) {
            closePhoto();
          }
        });
        document.addEventListener("keydown", (event) => {
          if (event.key === "Escape" && !photoModal.hidden) {
            event.stopPropagation();
            closePhoto();
          }
        }, true);
      }

      const topBar = document.getElementById("site-top");
      const cover = document.getElementById("cover");
      if (topBar && cover) {
        const syncBar = () => topBar.classList.toggle("is-solid", window.scrollY > cover.offsetHeight - 60);
        syncBar();
        window.addEventListener("scroll", syncBar, { passive: true });
        window.addEventListener("resize", syncBar, { passive: true });
      }

      const stage = document.getElementById("man-stage");
      const rig = document.getElementById("man-rig");
      const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (stage && rig && !reduceMotion) {
        let visible = true;
        let frame = 0;
        let px = 0;
        let py = 0;

        const draw = () => {
          frame = 0;
          const box = stage.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const dx = (px - cx) / Math.max(window.innerWidth * 0.45, 1);
          const dy = (py - cy) / Math.max(window.innerHeight * 0.45, 1);
          const ry = Math.max(-1, Math.min(1, dx)) * 32;
          const rx = Math.max(-1, Math.min(1, dy)) * -18;
          rig.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        };

        const track = (x, y) => {
          px = x;
          py = y;
          if (!frame && visible) frame = window.requestAnimationFrame(draw);
        };

        const reset = () => {
          if (frame) {
            window.cancelAnimationFrame(frame);
            frame = 0;
          }
          rig.style.transform = "";
        };

        window.addEventListener("pointermove", (e) => track(e.clientX, e.clientY), { passive: true });
        window.addEventListener("mouseleave", reset);
        stage.addEventListener("touchend", reset, { passive: true });
        stage.addEventListener("touchcancel", reset, { passive: true });
        stage.addEventListener("touchstart", (e) => {
          const t = e.changedTouches[0];
          if (t) track(t.clientX, t.clientY);
        }, { passive: true });
        stage.addEventListener("touchmove", (e) => {
          const t = e.touches[0];
          if (t) track(t.clientX, t.clientY);
        }, { passive: true });

        if ("IntersectionObserver" in window) {
          new IntersectionObserver((entries) => {
            visible = entries[0].isIntersecting;
            if (visible && !frame) frame = window.requestAnimationFrame(draw);
          }).observe(stage);
        }
      }


      (function () {
        const track = document.getElementById("shots");
        const input = document.getElementById("shot-input");
        const addBtn = document.getElementById("shot-add");
        const empty = document.getElementById("shots-empty");
        if (!track || !input || !addBtn) return;

        const KEY = "zhoujiaban.photos";
        const SEED = [
          { src: "cover-photo.jpg", alt: "肘家班的合影" },
          { src: "class-photo-800.webp", alt: "高三十二班合影" },
          { src: "promise-photo.webp", alt: "操场上的合影" },
          { src: "apology-photo.webp", alt: "和老师在一起" }
        ];

        const load = () => {
          try {
            const v = JSON.parse(localStorage.getItem(KEY) || "[]");
            return Array.isArray(v) ? v : [];
          } catch (e) {
            return [];
          }
        };
        const save = (list) => {
          try {
            localStorage.setItem(KEY, JSON.stringify(list));
            return true;
          } catch (e) {
            alert("浏览器本地空间不够了，先删掉几张再上传。");
            return false;
          }
        };

        const shrink = (file) => new Promise((resolve, reject) => {
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            const max = 1400;
            const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
            const w = Math.round(img.naturalWidth * scale);
            const h = Math.round(img.naturalHeight * scale);
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.82));
          };
          img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
          };
          img.src = url;
        });

        const cell = (item, editable) => {
          const box = document.createElement("div");
          box.className = "shot";
          const img = document.createElement("img");
          img.src = item.src;
          img.alt = item.alt || "照片";
          img.loading = "lazy";
          img.decoding = "async";
          box.appendChild(img);
          if (item.id && editable) {
            const del = document.createElement("button");
            del.type = "button";
            del.className = "shot-del";
            del.textContent = "\u00d7";
            del.title = "删除这张";
            del.addEventListener("click", (event) => {
              event.stopPropagation();
              save(load().filter((photo) => photo.id !== item.id));
              render();
            });
            box.appendChild(del);
          }
          return box;
        };

        const render = () => {
          const items = SEED.concat(load());
          empty.hidden = items.length > 0;
          track.textContent = "";
          [true, false].forEach((visible) => {
            const set = document.createElement("div");
            set.className = "photo-set";
            if (!visible) set.setAttribute("aria-hidden", "true");
            items.forEach((item) => set.appendChild(cell(item, visible)));
            track.appendChild(set);
          });
        };

        addBtn.addEventListener("click", () => input.click());
        input.addEventListener("change", async () => {
          const files = Array.from(input.files || []);
          input.value = "";
          if (!files.length) return;
          const list = load();
          for (const file of files) {
            if (!file.type.startsWith("image/")) continue;
            try {
              const src = await shrink(file);
              list.push({ id: String(Date.now()) + Math.random().toString(16).slice(2, 8), src, alt: file.name });
            } catch (e) {
              /* unreadable file: skip */
            }
          }
          if (save(list)) render();
        });

        render();
      })();
    