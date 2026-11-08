/* 全站中英切换：字典 + 文本节点替换 */
(function () {
  var DICT = {
"2026 年 5 月 18 日，学校举行成人礼。": "On May 18, 2026, the school held its coming-of-age ceremony.",
"@三个人把同学架着抬起来": "Three people hoisting a classmate up in the air",
"@两名同学隔着课桌对拳的动画，背景写着「勤学探究 日新共勉」": "Animation of two classmates fist-bumping across their desks, with 'Study Diligently, Explore Deeply; Renew Daily, Encourage Each Other' written in the background",
"@中国地图，标注目前肘家班成员分布": "A map of China marking where Zhoujiaban members are now",
"@举起手机对着同学拍": "Holding up a phone to film a classmate",
"@仰头大笑的课间": "Break time, heads thrown back in laughter",
"@关闭": "Close",
"@动图：教室里的几秒钟": "GIF: a few seconds in the classroom",
"@动图：泳池里的一段": "GIF: a stretch in the pool",
"@南海诸岛": "South China Sea Islands",
"@可旋转的粉色小猪 3D 模型": "A rotatable pink piggy 3D model",
"@围成一圈俯拍的脸": "A circle of faces shot from above",
"@在哈尔滨枫叶小镇的室内温泉池里合影": "Group photo in the indoor hot spring pool at Maple Leaf Town, Harbin",
"@在操场上看台前的肘家班合影": "Zhoujiaban group photo in front of the stands on the sports field",
"@在水里张开双手": "Arms spread wide in the water",
"@在泳池里背着人": "Carrying someone on his back in the pool",
"@在绿色柜子前比手势": "Posing in front of the green lockers",
"@在酒店楼下的采耳店": "At the ear-cleaning shop downstairs from the hotel",
"@地图配色": "Map color scheme",
"@坐在课桌前看向镜头": "Sitting at a desk looking at the camera",
"@复制微信号": "Copy WeChat ID",
"@夜晚登船": "Boarding the ship at night",
"@大连": "Dalian",
"@大连市区地标分布": "Landmarks across downtown Dalian",
"@微信收款二维码": "WeChat payment QR code",
"@成员列表": "Member list",
"@成员头像": "Member avatars",
"@打赏": "Tip us",
"@披萨盒前的自拍": "Selfie in front of the pizza box",
"@操场上的六人自拍": "Six-person selfie on the sports field",
"@支付宝收款二维码": "Alipay payment QR code",
"@教学楼前骑在同学肩上": "Riding on a classmate's shoulders in front of the teaching building",
"@教室里和老师的自拍": "Selfie with the teacher in the classroom",
"@教室里比耶的瞬间": "A peace-sign moment in the classroom",
"@教室里笑得最开的一张": "The biggest laugh in the classroom",
"@星海广场前的合影": "Group photo in front of Xinghai Square",
"@晚自习：从身后按住两个同学的头": "Evening study: holding down two classmates' heads from behind",
"@查看曹宇桓的头像": "View Cao Yuhuan's avatar",
"@橙色教室门口挤在一张椅子上": "Crammed onto one chair at the orange classroom door",
"@海边捡贝壳的同学": "A classmate picking up shells by the sea",
"@海边桥前的合影": "Group photo in front of the seaside bridge",
"@海边露台的合影": "Group photo on the seaside terrace",
"@点击放大地图": "Click to enlarge the map",
"@盘腿坐在柜子上": "Sitting cross-legged on the lockers",
"@目前肘家班成员分布地图": "Map of where Zhoujiaban members are now",
"@离开大连的动图": "GIF of leaving Dalian",
"@穿西装打领带的合照": "Group photo in suits and ties",
"@窗边与老师的合影": "Photo with the teacher by the window",
"@站内导航": "Site navigation",
"@给曹宇桓过生日的合影": "Group photo from Cao Yuhuan's birthday",
"@给猪过生日：戴皇冠许愿": "Celebrating Pig's birthday: crown on, making a wish",
"@老虎滩海边栏杆上的海鸥": "Seagulls on the seaside railing at Laohutan",
"@老虎滩海鲜档口": "Seafood stalls at Laohutan",
"@聚餐时举杯的合影": "Group photo raising glasses at the dinner",
"@肘家班同学与班主任在操场上合影": "Zhoujiaban classmates with their homeroom teacher on the sports field",
"@肘家班同学在操场上的合影": "Zhoujiaban classmates on the sports field",
"@肘家班水师": "Zhoujiaban Water Fleet",
"@肘家班的校园生活": "Zhoujiaban's campus life",
"@肘，释义肘击": "Zhou, as in elbow strike",
"@课桌前的比耶合影": "Peace-sign group photo at the desks",
"@课桌旁挤在一起比耶的自拍": "Selfie squeezed together by the desks throwing peace signs",
"@课间：弯腰递东西的瞬间": "Break time: bending over to hand something across",
"@贝壳盛的海鲜烧烤": "Seafood barbecue served in a shell",
"@车窗外的笑脸": "A smiling face outside the car window",
"@那个男人": "That man",
"@酒店房间里的另一张合影": "Another group photo in the hotel room",
"@酒店房间里的合影": "Group photo in the hotel room",
"@靠在墙边发呆的侧脸": "A profile leaning against the wall, spacing out",
"@高三十二班的同学们在操场上的合影": "Class 12, Grade 12 on the sports field",
"@高考倒计时板前的合影": "Group photo in front of the gaokao countdown board",
"© 2026 肘家班": "© 2026 Zhoujiaban",
"← 回到首页": "← Back to Home",
"← 返回我们的故事": "← Back to Our Story",
"主角": "Protagonist",
"从这一天起，曹宇桓失去了未成年人保护。": "From this day on, Cao Yuhuan lost the protection of being a minor.",
"付家庄公园": "Fujiazhuang Park",
"仪式": "Ceremony",
"任务": "Mission",
"会亲自给您发微信致谢。": "will personally message you on WeChat to say thanks.",
"偶遇美食": "Stumbling on good food",
"元旦联欢会": "New Year's Day party",
"元老级成员": "Veteran member",
"共 12 位成员，散布在 12 座城市：从黑河到福州，从西安到上海。": "12 members in all, scattered across 12 cities: from Heihe to Fuzhou, from Xi'an to Shanghai.",
"关于我们": "About Us",
"其余成员": "The rest of the members",
"凝视者": "The Gazer",
"创建初史": "The Early Days",
"创立": "Founding",
"千里搭长棚，天下没有不散的筵席。虽然高中生活结束了，我们各自投奔了自己的前程；即使相隔千里，我们的心也连在一处，永不离散": "A long shed is built for a thousand li, but no banquet under heaven lasts forever. High school is over and we have each gone after our own futures; even a thousand li apart, our hearts are joined as one and will never come apart",
"南海诸岛": "South China Sea Islands",
"卫星": "Satellite",
"可以请我们喝一瓶冰可乐。": "you can treat us to a bottle of ice-cold Coke.",
"合并，这支庞大的队伍索性取名": "merged, this enormous crew simply took the name",
"名字": "Name",
"向下滑动 ↓": "Scroll down ↓",
"吕奥": "Lv Ao",
"吕家军": "Lv's Army",
"周佳聪": "Zhou Jiacong",
"哈尔滨市剑桥第三中学": "Harbin Jianqiao No.3 High School",
"哈尔滨市剑桥第三中学 · 高三十二班": "Harbin Jianqiao No.3 High School · Class 12, Grade 12",
"唯一没有离散的，只有": "The only ones who never scattered are",
"图片内少了张桓，因为张桓秘书在拍照": "Zhang Huan is missing from the photo, because Secretary Zhang Huan was the one taking it",
"地点是曹宇桓在哈南之星租的房子。去超市随便买了点熟食，又给猪订了个蛋糕。虽然一切看起来很简陋，但那天喝得是真的高兴。": "The place was the flat Cao Yuhuan rented at Hanan Star. We grabbed some cold cooked food at the supermarket and ordered Pig a cake. It all looked pretty bare-bones, but that night we drank like we really meant it.",
"声明：不是 Gay": "Disclaimer: not gay",
"声明：本网站里的内容纯属虚构，请自行分辨，切勿当真。": "Disclaimer: everything on this site is pure fiction. Judge for yourself, and please don't take it seriously.",
"夜间": "Night",
"大家似乎意识到了什么，于是开始疯狂记录。": "Everyone seemed to realize something, and started recording like crazy.",
"大连": "Dalian",
"大连会师": "Meet-up in Dalian",
"大连市区 · 地标分布": "Downtown Dalian · Landmarks",
"大连旅程的最后一天，只剩下我和张桓。其他成员陆续返回哈尔滨，我们俩去了老虎滩。这里的海鸥似乎比星海广场的胆子更大。我们沿着海岸线漫无目的地走着，看着雾蒙蒙的海面。": "On the last day of the Dalian trip, only Zhang Huan and I were left. The others headed back to Harbin one after another, so the two of us went to Laohutan. The seagulls here seem bolder than the ones at Xinghai Square. We walked along the coastline with no particular destination, watching the misty sea.",
"大连港": "Port of Dalian",
"如果您觉得肘家班的故事有点意思，或者觉得这个网站做得不错，": "If you think Zhoujiaban's story is a bit of fun, or that this site turned out all right,",
"如果打赏，请备注您的名字，": "if you do tip, please leave your name,",
"威尼斯水城": "Venice Water Town",
"学过游泳，水性最好，负责教其余成员学会游泳。": "Took swimming lessons, the best in the water, and was in charge of teaching the rest of us to swim.",
"左右滑动查看更多成员": "Swipe left or right for more members",
"帅哥在睡觉": "A handsome guy, asleep",
"张昊": "Zhang Hao",
"张桓": "Zhang Huan",
"微信": "WeChat",
"微信号已复制": "WeChat ID copied",
"愿肘家班的友谊天长地久！": "May Zhoujiaban's friendship last forever!",
"成员": "Members",
"成员分布": "Where the members are",
"我与张桓在 2026 年 6 月 14 日晚坐船离开大连，在船上度过了与外界隔绝的 7 小时，随后抵达威海，开始了另一段新的旅行。至此，肘家班大连旅程落下帷幕。": "Zhang Huan and I left Dalian by boat on the night of June 14, 2026, spent seven hours on board cut off from the outside world, then reached Weihai and started another new trip. And with that, Zhoujiaban's Dalian journey came to a close.",
"我们为什么叫肘家班": "Why We're Called Zhoujiaban",
"我们的任务": "Our Mission",
"我们的创立": "Our Founding",
"我们的承诺": "Our Promise",
"我们的故事": "Our Story",
"我们的理念": "Our Philosophy",
"我们的致歉": "Our Apology",
"我和张桓点了一份": "Zhang Huan and I ordered a portion of",
"我和张桓走到海滨小路的尽头，发现一家很有意思的小摊，摊主在我们的脚下加工之后沿着梯子将食物传给上边的顾客。": "Zhang Huan and I walked to the end of the seaside path and found a really fun little stall: the owner prepped the food down at our feet and passed it up a ladder to the customers above.",
"我的微信：": "My WeChat:",
"或许在生活中某个心血来潮的提议，某个随意的决定，都会影响着我们的未来": "Maybe some off-the-cuff suggestion in life, some casual decision, ends up shaping our future",
"打开官网": "Open the official site",
"打赏": "Tip us",
"打赏 · 肘家班": "Tip Us · Zhoujiaban",
"执行【任务】中": "Mission in progress",
"承诺": "Promise",
"拖动旋转": "Drag to rotate",
"挑战用舌头吃光星球杯": "Challenge: lick a Planet Cup clean with your tongue",
"捆起来 怕逃跑": "Tied up, in case he runs",
"提供了近 80% 的素材。": "provided almost 80% of the material.",
"支付宝": "Alipay",
"日间": "Day",
"星海公园": "Xinghai Park",
"星海广场": "Xinghai Square",
"是水师不是溺尸": "Water Fleet, not a drowned corpse",
"曹宇桓": "Cao Yuhuan",
"最后的晚餐": "The Last Supper",
"最奇怪的感觉之一是当你一边还在经历一个时刻，一边就已经知道自己将来会多么怀念它。": "One of the strangest feelings is knowing, while you're still inside a moment, just how much you'll miss it later.",
"期待着肘家班水师下一次扬帆起航。": "Here's to the Zhoujiaban Water Fleet setting sail again.",
"本是同根生，相煎何太急": "Born of the same root, why burn each other so fiercely?",
"朱星驰": "Zhu Xingchi",
"校园生活": "Campus Life",
"校园生活很长，可是能留下的图片却屈指可数，": "Campus life was long, but the pictures we kept are few and far between,",
"毕业前夕": "The Eve of Graduation",
"江瑶贝": "Jiang Yaobei",
"注：水师创始人": "Note: founder of the Water Fleet",
"洗浴中心没办法拍照，能留下的素材太少了。": "You can't take photos in the bathhouse, so there's very little footage of it.",
"渔人码头": "Fisherman's Wharf",
"点击下方图标，走进肘家班的故事": "Click the icons below and step into Zhoujiaban's story",
"点击放大地图": "Click to enlarge the map",
"猪": "Pig",
"猪的十八岁生日过完了，希望过年的时候不要被别人捆住。": "Pig's eighteenth birthday is over, and here's hoping nobody ties him up over New Year.",
"猪的生日": "Pig's Birthday",
"猪肚展示": "Pig belly showcase",
"王振蘅": "Wang Zhenheng",
"王源泉": "Wang Yuanquan",
"王者禹": "Wang Zheyu",
"环球金融中心": "Dalian World Financial Center",
"理念": "Philosophy",
"的生日": "'s Birthday",
"的雏形": "'s prototype",
"目前肘家班成员分布": "Where Zhoujiaban Members Are Now",
"目前肘家班成员分布 · 肘家班": "Where Zhoujiaban Members Are Now · Zhoujiaban",
"直至这个男人出现使这两支队伍找到了共同打击对象，也就有了": "Until this man showed up and gave both crews a common target, and that is how you get",
"碎片": "Fragments",
"离开大连": "Leaving Dalian",
"结尾": "Epilogue",
"结语": "Closing Words",
"给猪过生日": "Celebrating Pig's Birthday",
"给猪过生日 · 肘家班": "Celebrating Pig's Birthday · Zhoujiaban",
"翻看相册的时候，我总会具象地、惊讶地意识到，我的生命中那些美好的瞬间是真实存在过的，像走马灯一样在我的脑海里重播。我们都不懂时间的重量，所以当离别真正到来的时候，只能傻傻愣在原地。人有时候突然变得脆弱，被漫长回忆里某个细节抓住，突然陷入深深的沉默，妄想在记忆里刻舟求剑。后来我们才明白，有些东西失去以后，我们唯一能做的只有怀念。": "When I flip through the album, I always realize, concretely and with a jolt, that those beautiful moments in my life really did exist, replaying in my head like a carousel. None of us understood the weight of time, so when the parting actually came, all we could do was stand there dumbly. Sometimes a person suddenly turns fragile, caught by some detail buried in a long memory, sinking into a deep silence, foolishly trying to carve a boat to find a sword that has already sunk. Only later did we understand that once some things are lost, the only thing left to do is miss them.",
"老师叫我们去罚站，不是惩罚我们，而是惩罚曲战银同学。": "The teacher sent us to stand in punishment, not to punish us but to punish Qu Zhanyin.",
"老猪一回笼就开心": "Old Pig is happy the moment he is back in his cage",
"老虎滩": "Laohutan",
"聚餐": "Group Dinner",
"肘": "Elbow",
"肘击": "Elbow Strike",
"肘家班": "Zhoujiaban",
"肘家班之名，起于我与王源泉一次课上的打闹。当时二人互相肘击，较量谁能把疼痛忍到最后。这项比试渐渐传入团体，大家都开始加入肘击game，当然，这里面最厉害的是我。后期": "The name Zhoujiaban began with a scuffle between me and Wang Yuanquan in class. We were elbowing each other, seeing who could take the pain the longest. The contest gradually spread through the group and everyone started joining the elbow-strike game, and of course the best of them all was me. Later",
"肘家班创始人兼网站制作者": "Founder of Zhoujiaban and maker of this website",
"肘家班创始人带副创始人在酒店楼下采耳": "The Zhoujiaban founder taking the co-founder for ear cleaning downstairs from the hotel",
"肘家班在大连": "Zhoujiaban in Dalian",
"肘家班在大连 · 肘家班": "Zhoujiaban in Dalian · Zhoujiaban",
"肘家班坚持走中国特色社会主义道路，坚定不移听党话、跟党走，坚定理想信念，厚植家国情怀；团结协作、担当实干，守正向善、行有所止。以青春之力践行使命，以同心之志共赴远方，恪守底线，扶危规过，携手为民族复兴贡献青春力量！": "Zhoujiaban firmly follows the path of socialism with Chinese characteristics, listens to the Party and follows the Party without wavering, holds fast to its ideals and convictions, and deepens its love for the country and home. We work together as a team, take responsibility and get things done, stay upright and kind, and know where to draw the line. We carry out our mission with the strength of youth, travel far together with one heart, hold to the bottom line, help those in trouble and correct our mistakes, and join hands to contribute our youthful strength to national rejuvenation!",
"肘家班校内记录员": "Zhoujiaban's on-campus record keeper",
"肘家班水师": "Zhoujiaban Water Fleet",
"肘家班水师 · 肘家班": "Zhoujiaban Water Fleet · Zhoujiaban",
"肘家班水师初见雏形": "The Zhoujiaban Water Fleet first takes shape",
"肘家班的成人礼": "Zhoujiaban's Coming-of-Age Ceremony",
"肘家班的成员都有一个共同的爱好，对洗浴中心、温泉、游泳情有独钟。于是 2026 年 6 月 12 日，在大连付家庄公园，肘家班水师正式成立。": "All Zhoujiaban members share one hobby: a soft spot for bathhouses, hot springs and swimming. So on June 12, 2026, at Fujiazhuang Park in Dalian, the Zhoujiaban Water Fleet was officially founded.",
"肘家班的校园生活": "Zhoujiaban's Campus Life",
"肘家班的校园生活 · 肘家班": "Zhoujiaban's Campus Life · Zhoujiaban",
"肘家班的诞生地点": "Where Zhoujiaban Was Born",
"致歉": "Apology",
"艺术家": "The Artist",
"被罚站也是一种奖励": "Getting sent to stand in punishment is a reward too",
"诞生在哈尔滨市剑桥第三中学高三十二班。一群关系很好的高中同学，后来成了肘家班。": "Born in Class 12, Grade 12 at Harbin Jianqiao No.3 High School. A bunch of high-school classmates who were close, and later became Zhoujiaban.",
"诞生地点": "Birthplace",
"还没有照片。": "No photos yet.",
"这个网站没有底线，因为我们的故事还在书写。": "This site has no limits, because our story is still being written.",
"这个网站还不完整，因为我们之间的故事是写不完的。": "This site is still incomplete, because the story between us can never be finished.",
"这个视频能把我笑死。": "This video kills me.",
"这个页面没有底线，因为我们的故事还在书写": "This page has no limits, because our story is still being written",
"这个页面还不完整，因为我们之间的故事是写不完的": "This page is still incomplete, because the story between us can never be finished",
"郎宏泽": "Lang Hongze",
"金额随意，全凭心意。您的鼓励就是我继续做下去的动力。我代表肘家班全体成员感谢您的浏览与支持！": "Any amount is fine; it is the thought that counts. Your encouragement is what keeps me going. On behalf of all of Zhoujiaban, thank you for stopping by and for your support!",
"队伍合并": "The Crews Merge",
"颓废者": "The Slacker",
"驰家军": "Chi's Army",
"高三十二班": "Class 12, Grade 12",
"高中校园生活结束了，十二班解散了，班上的老师也换了新的搭档。": "High school is over, Class 12 has disbanded, and the teachers have new partners now.",
"高二，「将军时代」落幕。班内逐渐形成两支队伍：一支由我率领的吕家军，一支由朱星驰率领的驰家军。两支队伍每日对垒，冲突持续数月，近于一场持久的部落冲突。": "In sophomore year the 'General Era' came to a close. Two crews gradually took shape in the class: Lv's Army, led by me, and Chi's Army, led by Zhu Xingchi. The two sides clashed every day, and the conflict dragged on for months, closer to a drawn-out tribal war.",
"，一贝两吃，一半蘸酱油生食，一半做成烧烤放在贝壳中。生食直取大海本味，肉质紧实脆嫩，鲜甜清爽；做成烧烤用热力逼出肉汁，香料醇厚浓郁，搭配着青椒一起食用显得格外爽口。": ", one shell served two ways: half eaten raw with soy sauce, half grilled and served in the shell. Raw gets the ocean's own flavor, firm and crisp, fresh and sweet; grilling draws out the juices with deep, rich spices, and eaten with green pepper it tastes especially refreshing.",
"📍哈尔滨枫叶小镇": "📍Maple Leaf Town, Harbin",
"肘家班出自哈尔滨市剑桥第三中学高三十二班。": "Zhoujiaban comes out of Class 12, Grade 12 at Harbin Jianqiao No.3 High School.",
"作为十二班的一员，我们的行为给班主任带来了很多不必要的麻烦，给她出了很多难题，也多次惹她生气。但她对我们十分照顾与包容，愿意抽出时间辅导我们功课、督促我们学习、聆听我们的心声。肘家班很荣幸遇到这么好的老师，同时也对我们的行为感到抱歉与愧疚。在这里，肘家班诚恳道歉。": "As members of Class 12, our behavior brought our homeroom teacher plenty of unnecessary trouble, gave her plenty of headaches and made her angry more than once. Yet she looked after us and put up with us, and was always willing to make time to tutor us, push us to study and listen to what was on our minds. Zhoujiaban is lucky to have met such a good teacher, and we are sorry and ashamed of how we behaved. Here, Zhoujiaban offers a sincere apology.",
"肘家班成员互帮互助、互相信任，笑过、骂过、脸红过，就是没有散过；处理事情对事不对人，遇到困难一致对外，遇到难题勇往直前；凝心聚力、彼此支撑，携手共度每一道难关。我们不只是酒肉朋友，更是能在顺境时互相勉励、逆境时不离不弃，真心相待、长久同行。愿肘家班的友谊天长地久！": "Zhoujiaban members help each other and trust each other: we have laughed, cursed and flushed red at one another, but we have never fallen apart. We deal with the issue, not the person; when trouble comes we face it as one, and when a problem appears we charge straight ahead. We gather our strength, hold each other up, and get through every hard stretch hand in hand. We are more than fair-weather friends: we can encourage each other in good times and refuse to let go in bad, treating each other sincerely and walking on together for the long haul. May Zhoujiaban's friendship last forever!",
"我们的创立 · 肘家班": "Our Founding · Zhoujiaban",
"行为": "behavior",
"身上的异味": "body odor",
"生活习惯": "habits ",
"已经严重违背正常人和不断恶心着同学们。他们给班级带来了恶劣的影响，制造出笑柄，抹黑班级。": "have already badly violated what any normal person would accept, and they keep disgusting their classmates. They brought real harm to the class, became a running joke, and dragged its name through the mud.",
"在法律的保护下不断违背最基本的道德，有的甚至借着自身精神上的缺陷骚扰班级的其他同学，影响同学们的心情，影响老师的心情。": "Shielded by the law, they keep violating the most basic decency; some even use their own mental issues as cover to harass other classmates, souring everyone's mood — students' and teachers' alike.",
"当这种群体令人无能为力的时候，就有了我们": "When there was nothing anyone could do about people like that, we came to be — ",
"【肘家班】": "[Zhoujiaban]",
"不标榜高尚，我们只求一片净土。既然道德的约束对他们无效，法律的惩戒对他们来说太远，那我们便成为那堵隔绝恶心与正常的“": " We don't claim to be noble; we only wanted one clean patch of ground. Since morality doesn't restrain them and the law's punishment is too far away, we became that “",
"叹息之墙": "Wall of Sighs",
"我们的存在，是为了让那些在角落里默默忍受的同学们能喘一口气；是为了让那些肆无忌惮的“巨婴”们知道——在校园的阴暗面里，也有一双双眼睛在盯着你们。": "We exist so that classmates quietly enduring in the corners can finally breathe; and so that those shameless “man-children” know — in the dark corners of campus, pairs of eyes are watching you.",
"我们的任务 · 肘家班": "Our Missions · Zhoujiaban",
"救其困，规其过": "Help the Troubled, Correct the Wrong",
"提醒有问题的同学，指出他们的错误，帮助他们发现问题并要求他们改正问题。": "We remind classmates who have problems, point out their mistakes, help them see the problem and ask them to fix it.",
"因人而施，量类而待": "Deal with Each According to Their Kind",
"在有问题的同学中分为两种，": "The classmates in question come in two kinds: ",
"一种是愿意接受和整改的": "those who accept it and are willing to change",
"：他们有的进行道歉，有的把桌子挪到远离人群的地方。对于这种同学，": ". Some apologize; some move their desk away from everybody else. For classmates like these, ",
"愿意帮助他们恢复状态和改正问题；当其他同学都排挤他们的时候，肘家班的成员也愿意与他们一起玩，": " we are glad to help them get back on track and fix their problems; when everyone else shuts them out, Zhoujiaban members are still happy to hang out with them — ",
"带他一起踢球、一起聊天。只要能改正问题，我们愿意和他们成为": " taking them along to play football or just to talk. As long as the problem gets fixed, we're happy to be their ",
"以恶惩恶，以暴制暴": "Punish Evil with Evil, Meet Force with Force",
"另一种则是不愿意接受整改的": "The others refuse to change",
"：不仅不接受整改，反而变本加厉；甚至在我们做出提醒、劝告时，以暴力的方式来回馈我们——例如向我们": ": they don't just refuse — they double down, and when we remind or advise them, they answer with violence — for example, ",
"吐痰": "spitting at us",
"辱骂": "cursing",
"我们、向老师和家长": " us, or ",
"诬陷": "framing",
"我们。那么肘家班就会使用他们最擅长的方式，": " us to the teachers and parents. Then Zhoujiaban uses the method they understand best — ",
"在尽量不影响老师工作的前提下，我们的": "While trying not to disturb the teachers' work, our ",
"们负责着日常的": " handle the day-to-day ",
"。当他们再一次恶心别人、恶心我们的时候，我们将不再出言提醒，而是先派": ". When they disgust someone again, or disgust us again, we stop giving warnings: we send the ",
"进行肢体交流，用最原始的方式压制住他们的恶，让他们再次作恶时，最先想到我们的拳头，其次才是我们的脸。": " in for a physical talk, to crush that malice the most primitive way — so the next time they think about doing harm, the first thing that comes to mind is our fists, and only then our faces.",
"我们和老鼠们的斗争": "Our War with the Rats",
"这些老鼠既不愿整改，也不愿接受肘家班肢体上和精神上的交流。他们把我们告老师、告主任，施压老师惩罚我们，借着天眼约束我们，试图逃避我们的交流，": "These rats won't change and won't accept the physical or verbal exchange Zhoujiaban offers. They report us to teachers and the grade director, pressure the teachers to punish us, hide behind the surveillance cameras to keep us in check, trying to dodge the talk altogether, ",
"，让老鼠们无处遁形——让他们在上厕所的时候要防备，在楼梯间要防备，回家时也要防备……": ", so the rats have nowhere to hide — they have to watch their backs in the toilet, watch their backs on the stairwell, watch their backs on the way home...",
"临近毕业": "As graduation neared",
"，在各方面的压力下，我们没有办法再和老鼠们斗智斗勇，我们也不能因为个别老鼠放弃自己的未来。对于这些老鼠的行为，肘家班无法继续": ", under pressure from every side, we could no longer keep outsmarting the rats, and we couldn't give up our own futures over a few of them. Against these rats, Zhoujiaban can no longer keep up the ",
"。但是老鼠终究是老鼠，即使毕业后没有十二班的肘家班，在老鼠们的未来也会出现千千万万个": ". But a rat is still a rat: even without a Zhoujiaban in Class 12 after graduation, thousands of Zhoujiabans will show up in the rats' futures.",
"任务成果": "Mission Results",
"有了": "With ",
"部分有问题的同学恢复了正常，甚至发现了自己的闪光点；他们把闪光点展示给了同学和老师，并得到了表扬。": "Zhoujiaban, some of the classmates with problems got back to normal — some even found their own strengths, showed them to classmates and teachers, and were praised for it.",
"在她心里出现障碍、甚至想到": "When a classmate hit a mental block, and even thought about ",
"轻生": "taking her own life",
"的时候，": ", ",
"的成员也帮助老师第一时间救下她、疏导她、帮助她恢复。对于老鼠们来说，": "Zhoujiaban members helped the teachers reach her first, calm her down, and help her recover. As for the rats, ",
"也让他们对自己的行为感到羞耻，再次恶心别人时也会三思、会收敛，程度不会像最开始那么恶劣，还同学们和老师们一片净土。": "Zhoujiaban made them ashamed of how they acted; the next time they think about disgusting someone they pause and pull back, nothing like their first days — giving the students and teachers a clean place again.",
"我们的承诺 · 肘家班": "Our Promise · Zhoujiaban",
"我们的成就 · 肘家班": "Our Achievements · Zhoujiaban",
"我们的成就": "Our Achievements",
"肘家班在【任务】之外的成就记录，之后会逐步整理在这里。": "A record of what Zhoujiaban achieved outside its [missions] — to be filled in over time.",
"内容整理中，稍后补上。": "Content in progress — coming soon.",
"在令人压抑焦躁的学校生活中，大家的戾气会变得很重，在校园生活里就难免会出现这样一种人，他们在不要脸的前提之下肆意恶心、影响着身边的同学，他们的": "In the oppressive, restless life of school, tempers run hot, and campus life inevitably produces a certain kind of person — someone who, with no shame at all, makes a point of disgusting and dragging down the classmates around them. Their ",
"← 返回": "← Back",
"例如": "for example",
"朋友": "friends",
"用最原始的方式解决问题": "the most primitive way of settling things",
"金牌打手": "Gold Gloves",
"【任务】": "[missions]",
"这些老鼠既不愿整改，也不愿接受肘家班肢体上和精神上的交流。他们把我们告老师、告主任，施压老师惩罚我们，借着天眼约束我们，试图逃避我们的交流，让我们在很长时间里受尽折磨。我们与老鼠们也进入了长期的斗争：美好的空间里也存在阴暗面，我们游走各大阴暗面惩罚老鼠们，执行我们的": "These rats won't change and won't accept the physical or verbal exchange Zhoujiaban offers. They report us to teachers and the grade director, pressure the teachers to punish us, hide behind the surveillance cameras to keep us in check, trying to dodge the talk altogether — and we end up suffering for a long time. So we entered a long war with the rats too: even beautiful places have a dark side, and we roam those dark corners to punish the rats, carrying out our ",
"。": ".",
"、": ", "
};
  var EN = document.documentElement.classList.contains('lang-en');
  var ATTRS = ['alt', 'title', 'placeholder', 'aria-label'];

  function tr(key) {
    var k = String(key).trim();
    if (!k) return null;
    if (Object.prototype.hasOwnProperty.call(DICT, k)) return DICT[k];
    return null;
  }

  function walkText() {
    var root = document.body;
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('.lang-toggle')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      if (n.__zh === undefined) n.__zh = n.nodeValue;
      var src = EN ? n.__zh : n.nodeValue;
      if (!EN) continue;
      var t = tr(src);
      if (t === null) continue;
      var lead = src.match(/^\s*/)[0];
      var trail = src.match(/\s*$/)[0];
      n.nodeValue = lead + t + trail;
    }
  }

  function walkAttrs() {
    var els = document.body ? document.body.querySelectorAll('[alt],[title],[placeholder],[aria-label]') : [];
    Array.prototype.forEach.call(els, function (el) {
      ATTRS.forEach(function (a) {
        var v = el.getAttribute(a);
        if (!v) return;
        var store = '__zh_' + a;
        if (el[store] === undefined) el[store] = v;
        if (!EN) return;
        var t = tr(el[store]);
        if (t === null) return;
        el.setAttribute(a, t);
      });
      if (!EN) {
        ATTRS.forEach(function (a) {
          if (el['__zh_' + a] !== undefined) el.setAttribute(a, el['__zh_' + a]);
        });
      }
    });
  }

  function apply() { walkText(); walkAttrs(); }

  function injectToggle() {
    if (document.querySelector('.lang-toggle')) return;
    var host = document.querySelector('header nav') || document.querySelector('.top nav') || document.querySelector('nav');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-toggle';
    btn.textContent = EN ? '中文' : 'EN';
    btn.addEventListener('click', function () {
      try { localStorage.setItem('zjban.lang', EN ? 'zh' : 'en'); } catch (e) {}
      location.reload();
    });
    if (host) {
      host.appendChild(btn);
    } else {
      btn.style.position = 'fixed';
      btn.style.right = '18px';
      btn.style.bottom = '18px';
      btn.style.zIndex = '60';
      document.body.appendChild(btn);
      return;
    }
    btn.style.marginLeft = '14px';
    btn.style.padding = '4px 10px';
    btn.style.font = 'inherit';
    btn.style.fontSize = '0.82rem';
    btn.style.fontWeight = '600';
    btn.style.color = '#0071e3';
    btn.style.background = 'rgba(0,113,227,.08)';
    btn.style.border = '1px solid rgba(0,113,227,.28)';
    btn.style.borderRadius = '999px';
    btn.style.cursor = 'pointer';
    btn.style.lineHeight = '1.5';
  }


  function injectStyle() {
    if (document.getElementById('lang-toggle-style')) return;
    var st = document.createElement('style');
    st.id = 'lang-toggle-style';
    st.textContent = '.lang-toggle:hover{background:rgba(0,113,227,.16)}' +
      'body.map-night .lang-toggle{color:#8cc0ff;border-color:rgba(140,192,255,.45);background:rgba(140,192,255,.12)}';
    document.head.appendChild(st);
  }

  function boot() {
    injectStyle();
    if (EN) apply();
    injectToggle();
    // 动态内容（成员卡等）插入后再跑一次
    var mo = new MutationObserver(function () { if (EN) apply(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { if (EN) apply(); }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
