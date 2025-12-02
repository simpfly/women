import { Term } from '../types';

export const FEMINIST_DICTIONARY: Term[] = [
    // --- ACADEMIC (社会学/理论) ---
    {
        id: "d_ac_01",
        term: "父权制",
        english: "Patriarchy",
        category: "ACADEMIC",
        definition: "一种社会制度，其中男性占据主要的权力位置，主导政治领导、道德权威、社会特权和财产控制。在家庭领域，父权制表现为父亲或男性长辈对妇女和儿童的权威。",
        example: "父权制不仅压迫女性，也要求男性压抑情感以符合'男子气概'，从而伤害了所有人。",
        relatedTermIds: ["d_ac_02", "d_ac_03"]
    },
    {
        id: "d_ac_02",
        term: "厌女",
        english: "Misogyny",
        category: "ACADEMIC",
        definition: "对女性的仇恨、蔑视或偏见。它可以通过多种方式表现出来，包括社会排斥、性别歧视、敌意、男性中心主义、父权制特权、贬低女性、对女性的暴力以及将女性性客体化。",
        example: "厌女症在男人身上表现为女性蔑视，在女人身上则表现为自我厌恶。",
        relatedTermIds: ["d_ac_01", "d_ac_12"]
    },
    {
        id: "d_ac_03",
        term: "男性凝视",
        english: "Male Gaze",
        category: "ACADEMIC",
        definition: "在视觉艺术和文学中，将女性描绘为异性恋男性观察者的愉悦对象。女性被客体化为'被看'的景致，而男性是拥有视线权力的主体。",
        example: "电影运镜特写女性身体部位，而非她的表情或行动，仅为了满足观众的视觉快感。",
        relatedTermIds: ["d_ac_04", "d_ac_08"]
    },
    {
        id: "d_ac_04",
        term: "客体化",
        english: "Objectification",
        category: "ACADEMIC",
        definition: "将人（通常是女性）视为物品、工具或身体部件的集合，忽视其人格、尊严、情感和主体性。",
        example: "车展上穿着暴露的车模，被当作吸引眼球的道具，而非被尊重的专业人士。",
        relatedTermIds: ["d_ac_03", "d_ac_13"]
    },
    {
        id: "d_ac_05",
        term: "交叉性",
        english: "Intersectionality",
        category: "ACADEMIC",
        definition: "由Kimberlé Crenshaw提出，指不同的压迫形式（如种族主义、性别歧视、阶级歧视）是相互交织、相互作用的，不能孤立看待。一个人的身份是多重维度的。",
        example: "黑人女性面临的歧视不仅仅是种族歧视加性别歧视的总和，而是一种独特的交叉体验。",
        relatedTermIds: ["d_ac_01"]
    },
    {
        id: "d_ac_06",
        term: "玻璃天花板",
        english: "Glass Ceiling",
        category: "ACADEMIC",
        definition: "指在职场或社会等级中，阻碍女性或少数群体晋升到高层管理职位的无形障碍。尽管她们能力足够，却因为隐形的偏见而无法突破。",
        example: "虽然她的业绩比所有男同事都好，但每次升职经理的机会都轮不到她。",
        relatedTermIds: ["d_ac_07", "d_ac_15"]
    },
    {
        id: "d_ac_07",
        term: "粘地板",
        english: "Sticky Floor",
        category: "ACADEMIC",
        definition: "相对于玻璃天花板，指女性被困在低薪、低晋升空间的基础岗位上（如服务业、行政助理），难以起步或脱身。",
        example: "许多女性主要集中在服务业、护理等职业，这些工作往往薪酬低且缺乏晋升通道。",
        relatedTermIds: ["d_ac_06", "d_ac_16"]
    },
    {
        id: "d_ac_15",
        term: "玻璃悬崖",
        english: "Glass Cliff",
        category: "ACADEMIC",
        definition: "指女性往往在公司或组织面临危机、失败风险极高时被任命为领导者。如果失败，她们则成为替罪羊；如果成功，往往被视为运气。",
        example: "公司股价暴跌、面临破产边缘时，董事会突然任命了一位女CEO来收拾残局。",
        relatedTermIds: ["d_ac_06"]
    },
    {
        id: "d_ac_08",
        term: "贝克德尔测试",
        english: "Bechdel Test",
        category: "ACADEMIC",
        definition: "衡量虚构作品中女性角色代表程度的简易测试。要求：1. 至少有两个女性角色；2. 她们互相交谈过；3. 谈话内容与男性无关。",
        example: "许多好莱坞大片竟然无法通过这个简单的测试，女性角色往往只是为了衬托男主角而存在。",
        relatedTermIds: ["d_ac_03"]
    },
    {
        id: "d_ac_09",
        term: "母职惩罚",
        english: "Motherhood Penalty",
        category: "ACADEMIC",
        definition: "指职场女性因为生育孩子而遭受的系统性不利对待，包括起薪更低、被认为能力不足或投入度低。相反，男性往往获得'父职红利'。",
        example: "面试时被问：'你有孩子了，还能适应加班吗？'",
        relatedTermIds: ["d_ac_10", "d_ac_11"]
    },
    {
        id: "d_ac_10",
        term: "情绪劳动",
        english: "Emotional Labor",
        category: "ACADEMIC",
        definition: "指为了满足工作或人际关系的需求，而管理自己情绪的过程。女性通常被社会期待承担更多无偿的情绪劳动，如安抚他人、维持和谐气氛。",
        example: "在办公室里，女性总是被期待要温柔、微笑、照顾大家的情绪，而男性发脾气则被视为'有性格'。",
        relatedTermIds: ["d_ac_11"]
    },
    {
        id: "d_ac_11",
        term: "第二轮班",
        english: "The Second Shift",
        category: "ACADEMIC",
        definition: "指职业女性在完成白天的带薪工作后，回家还要承担大部分无偿的家务劳动和照料工作。",
        example: "夫妻双职工下班回家，丈夫躺在沙发上玩手机，妻子却要立刻开始做饭、辅导孩子功课。",
        relatedTermIds: ["d_ac_09", "d_ac_10"]
    },
    {
        id: "d_ac_12",
        term: "内部厌女",
        english: "Internalized Misogyny",
        category: "ACADEMIC",
        definition: "指女性在父权制社会中成长，潜意识里接受了贬低女性的观念，并将其投射到自己或其他女性身上。",
        example: "女性声称'我更喜欢和男人玩，因为女人事儿多、心机重'。",
        relatedTermIds: ["d_in_01", "d_in_02"]
    },
    {
        id: "d_ac_13",
        term: "荡妇羞辱",
        english: "Slut Shaming",
        category: "ACADEMIC",
        definition: "通过攻击女性的性行为、性欲或着装来贬低、羞辱或控制女性的行为。这是对女性身体自主权的惩罚。",
        example: "因为她穿着短裙，就被人评论说'看起来很不检点'。",
        relatedTermIds: ["d_ac_14", "d_ac_04"]
    },
    {
        id: "d_ac_14",
        term: "受害者有罪论",
        english: "Victim Blaming",
        category: "ACADEMIC",
        definition: "在犯罪或侵害事件中，将部分或全部责任归咎于受害者的现象。这在性暴力案件中尤为常见。",
        example: "在性骚扰新闻下评论：'苍蝇不叮无缝的蛋，她为什么要大晚上出门？'",
        relatedTermIds: ["d_ac_13", "d_ac_18"]
    },
    {
        id: "d_ac_16",
        term: "粉红税",
        english: "Pink Tax",
        category: "ACADEMIC",
        definition: "指功能相同的产品，仅仅因为针对女性消费者（通常是粉色包装）而定价更高。",
        example: "成分完全相同的剃须刀，粉色的女款比蓝色的男款贵20%。",
        relatedTermIds: ["d_in_03"]
    },
    {
        id: "d_ac_17",
        term: "煤气灯效应",
        english: "Gaslighting",
        category: "ACADEMIC",
        definition: "一种心理操纵形式，施虐者通过否定受害者的记忆、感知或理智，使受害者怀疑自己的认知能力，从而产生依赖。",
        example: "当你指出他的不当言论时，他说：'你太敏感了，我根本不是那个意思，你是不是疯了？'",
        relatedTermIds: ["d_ac_14"]
    },
    {
        id: "d_ac_18",
        term: "善意的性别歧视",
        english: "Benevolent Sexism",
        category: "ACADEMIC",
        definition: "一种看似积极（如保护、赞美）但实则将女性视为弱者、需要男性保护的性别歧视。它奖励符合传统性别角色的女性，惩罚不符合的。",
        example: "“女孩子不用那么拼，找个好男人嫁了就行。”",
        relatedTermIds: ["d_ac_01"]
    },
     {
        id: "d_ac_19",
        term: "强奸文化",
        english: "Rape Culture",
        category: "ACADEMIC",
        definition: "一种社会环境，其中性暴力被正常化、合理化或被媒体和流行文化轻描淡写。表现为指责受害者、性化女性身体、开强奸玩笑等。",
        example: "认为男性有无法控制的性冲动，因此女性有责任避免被侵害，这是强奸文化的一部分。",
        relatedTermIds: ["d_ac_14", "d_ac_13"]
    },

    // --- INTERNET (互联网/流行语) ---
    {
        id: "d_in_00",
        term: "男性说教",
        english: "Mansplaining",
        category: "INTERNET",
        definition: "源自互联网的组合词（Man + Explaining）。指男人在没有被邀请的情况下，向女性（通常是该领域的专家或比他更了解的人）解释事情，且态度通常是居高临下或过度自信的。",
        example: "男同事向女程序员解释基础代码逻辑，而这部分代码正是她编写的。",
        relatedTermIds: ["d_in_05"]
    },
    {
        id: "d_in_01",
        term: "雌竞",
        english: "Female Competition",
        category: "INTERNET",
        definition: "网络流行语，指在父权制框架下，女性为了争夺男性的关注、喜爱或资源，而被迫进行的相互敌对和竞争。这种竞争往往是男性凝视的产物。",
        example: "不要为了一个渣男搞雌竞，女性应该联合起来。",
        relatedTermIds: ["d_ac_12", "d_in_06"]
    },
    {
        id: "d_in_02",
        term: "媚男 / Pick-me",
        english: "Pick-me Girl",
        category: "INTERNET",
        definition: "指那些为了获得男性认可，通过贬低其他女性（例如声称自己“不像其他女生那么作”）来迎合男性刻板印象的女性。",
        example: "“我只跟男生玩，因为女生事儿太多了。”",
        relatedTermIds: ["d_ac_12", "d_in_01"]
    },
    {
        id: "d_in_03",
        term: "服美役",
        english: "Beauty Duty",
        category: "INTERNET",
        definition: "中文互联网女权社群创造的词汇。指女性被迫花费大量金钱、时间、精力去维持符合单一社会标准的美貌，仿佛在服一种无法逃脱的劳役。",
        example: "为了在夏天穿吊带而过度节食、忍受激光脱毛的痛苦，就是在服美役。",
        relatedTermIds: ["d_ac_04", "d_ac_16"]
    },
    {
        id: "d_in_04",
        term: "丧偶式育儿",
        english: "Widowed Parenting",
        category: "INTERNET",
        definition: "形容在双亲家庭中，父亲虽然健在，但几乎不参与育儿和家务，导致母亲独自承担所有抚养责任，如同丧偶一般。",
        example: "爸爸回家只知道玩手机，妈妈忙得脚不沾地，这就是典型的丧偶式育儿。",
        relatedTermIds: ["d_ac_11", "d_ac_09"]
    },
    {
        id: "d_in_05",
        term: "爹味",
        english: "Dad-ish / Patronizing",
        category: "INTERNET",
        definition: "形容男性（有时也指女性）喜欢好为人师、以长辈或权威自居，对他人进行说教、指点江山，充满优越感和控制欲的油腻姿态。",
        example: "别跟我讲大道理，收收你的爹味。",
        relatedTermIds: ["d_in_00", "d_in_07"]
    },
    {
        id: "d_in_06",
        term: "开刃作",
        english: "Debut / First Blade",
        category: "INTERNET",
        definition: "女性主义创造的新词汇，用于替代“处女作”。拒绝将女性的初次创作与性贞洁（处女）挂钩。“开刃”寓意宝剑出鞘，锋芒初露，象征着女性力量与攻击性的觉醒。",
        example: "这是这位导演的第一部电影，是她的开刃作，锐利而生猛。",
        relatedTermIds: ["d_in_08"]
    },
    {
        id: "d_in_07",
        term: "普信",
        english: "Average but Confident",
        category: "INTERNET",
        definition: "源自脱口秀演员杨笠的段子：“他明明那么普通，却那么自信。”形容某些男性缺乏自我认知，尽管条件普通，却对女性挑三拣四或盲目自信。",
        example: "相亲遇到个普信男，一上来就挑剔我的学历。",
        relatedTermIds: ["d_in_05"]
    },
    {
        id: "d_in_08",
        term: "Herstory",
        english: "Herstory",
        category: "INTERNET",
        definition: "即“她的故事”，是对 History（历史/His story）的解构（注：History词源其实非His+story，但此词作为政治性重构有其意义）。旨在强调历史上被忽略、被掩盖的女性叙事。",
        example: "教科书里很少提到女性科学家，我们需要去挖掘和书写 Herstory。",
        relatedTermIds: ["d_in_06"]
    },
    {
        id: "d_in_09",
        term: "扶弟魔",
        english: "Helper of Brother",
        category: "INTERNET",
        definition: "指在重男轻女家庭中长大的女性，被家庭洗脑或强迫，无底线地牺牲自己的利益（金钱、生活）去资助弟弟。反映了家庭对女性的资源剥削。",
        example: "她工资的一半都要寄回家给弟弟买房，完全成了家里的扶弟魔。",
        relatedTermIds: ["d_ac_01"]
    }
];
