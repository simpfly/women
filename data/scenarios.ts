
import { Scenario, Category, AllergenLevel } from '../types';

export const STATIC_PARENTING_SCENARIOS: Scenario[] = [
    {
        id: "par_001",
        content: "亲戚看到小男孩摔倒哭了，立马说：“男孩子要坚强，不许哭，哭羞羞。”",
        category: Category.PARENTING,
        allergenName: "有毒男子气概 (Toxic Masculinity)",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "从小压抑男性的情感表达，灌输‘情感=软弱’的观念。这不仅伤害男孩的心理健康，也为成年后缺乏共情能力埋下伏笔。",
        wittyComment: "泪腺是人体生理结构，难道男性进化掉这个器官了吗？"
    },
    {
        id: "par_002",
        content: "你给女儿买了一套乐高机械组，邻居阿姨看到说：“哎呀，女孩子玩这个太费脑子了，不如买个芭比娃娃。”",
        category: Category.PARENTING,
        allergenName: "STEM领域的性别刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "过早地将‘理工科/逻辑’标记为男性领域，将‘外貌/照料’标记为女性领域，限制了女孩的潜能发展。",
        wittyComment: "脑子这东西，确实是越用越好用，不用容易生锈。"
    },
    {
        id: "par_003",
        content: "家里来客人，爸爸喊儿子去陪客人看电视，喊女儿去厨房帮妈妈切水果。",
        category: Category.PARENTING,
        allergenName: "家务分工的性别社会化",
        allergenLevel: AllergenLevel.MILD,
        analysis: "通过日常分配，潜移默化地灌输‘男主外（社交），女主内（服务）’的观念。",
        wittyComment: "看来厨房是女性专用VIP室，需要刷脸才能进？"
    },
    {
        id: "par_004",
        content: "学校选班干部，老师倾向于让男生当班长（负责决策），女生当生活委员（负责收钱、打扫）。",
        category: Category.PARENTING,
        allergenName: "领导力的性别偏见",
        allergenLevel: AllergenLevel.MILD,
        analysis: "从小培养男性的领导力和决策力，将女性局限在辅助和服务角色中。",
        wittyComment: "建议轮流坐庄，让男生也体验一下收班费的快乐。"
    },
    {
        id: "par_005",
        content: "亲戚夸奖男孩说“真聪明、有出息”，夸奖女孩说“真漂亮、真听话”。",
        category: Category.PARENTING,
        allergenName: "评价体系的双重标准",
        allergenLevel: AllergenLevel.MILD,
        analysis: "对男孩强调能力与未来，对女孩强调外貌与顺从，塑造了不同的自我期许。",
        wittyComment: "漂亮和听话能当饭吃吗？聪明和有出息才是硬通货。"
    },
    {
        id: "par_006",
        content: "童话故事里，公主总是等待王子来拯救，反派女巫总是因为嫉妒美貌而作恶。",
        category: Category.PARENTING,
        allergenName: "文化产品的性别刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "传统童话灌输了女性被动等待救赎、女性之间只有嫉妒竞争的观念。",
        wittyComment: "我想给孩子读读《纸袋公主》，看看公主是怎么把王子救出来还把他甩了的。"
    },
    {
        id: "par_007",
        content: "商场的玩具区，深蓝色区域全是枪、车、积木；粉红色区域全是娃娃、厨房、化妆台。",
        category: Category.PARENTING,
        allergenName: "玩具性别隔离",
        allergenLevel: AllergenLevel.MILD,
        analysis: "商业营销强行将玩具性别化，限制了孩子探索不同兴趣的机会。",
        wittyComment: "玩具没有性别，只有好玩和不好玩。"
    },
    {
        id: "par_008",
        content: "在学校里，男孩子调皮捣蛋被认为是“活泼、有创造力”，女孩子稍微大声一点就被批评“不像女孩子”。",
        category: Category.PARENTING,
        allergenName: "行为规范的双重标准",
        allergenLevel: AllergenLevel.MILD,
        analysis: "社会对男孩的越轨行为更加宽容，对女孩则要求严格的规训。",
        wittyComment: "活泼是天性，不分男女。"
    },
    {
        id: "par_009",
        content: "课本插图中，医生、科学家、飞行员大多是男性，护士、老师、服务员大多是女性。",
        category: Category.PARENTING,
        allergenName: "职业性别刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "视觉材料潜移默化地影响孩子对职业可能性的想象。",
        wittyComment: "下次我得给孩子画个女宇航员贴上去。"
    },
    {
        id: "par_010",
        content: "亲戚逗孩子：“长大了要娶个漂亮媳妇伺候你。”",
        category: Category.PARENTING,
        allergenName: "婚恋观灌输 / 女性工具化",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "从小灌输男性在婚姻中的特权地位，将女性视为服务者。",
        wittyComment: "长大了要学会照顾自己，找个灵魂伴侣，而不是找保姆。"
    },
    {
        id: "par_011",
        content: "学校校规里，详细规定了女生刘海长度、发圈颜色，对男生则只要求“短发”。",
        category: Category.PARENTING,
        allergenName: "身体规训差异",
        allergenLevel: AllergenLevel.MILD,
        analysis: "对女性身体的细节进行过度管理，从小培养女性“被审视”的自觉。",
        wittyComment: "学校是教育机构，不是美发沙龙监管局。"
    },
    {
        id: "par_012",
        content: "小男孩欺负小女孩（拉头发、掀裙子），大人在旁边笑说：“他这是喜欢你。”",
        category: Category.PARENTING,
        allergenName: "暴力浪漫化 / 边界意识缺失",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将侵犯行为美化为表达好感，不仅误导男孩如何表达爱，更让女孩学会忍受侵害。",
        wittyComment: "喜欢是送花、分享零食，不是动手打人。这是骚扰，不是喜欢。"
    },
    {
        id: "par_013",
        content: "给孩子报兴趣班，爷爷说：“孙子学跆拳道防身，孙女学舞蹈练气质。”",
        category: Category.PARENTING,
        allergenName: "身体能力的性别预设",
        allergenLevel: AllergenLevel.MILD,
        analysis: "预设男性需要力量和攻击性，女性需要柔美和被观看性，剥夺了女性掌握力量的机会。",
        wittyComment: "女孩更需要防身，男孩也需要练气质（比如学会优雅地闭嘴）。"
    },
    {
        id: "par_014",
        content: "聚餐时，让还没桌子高的小女孩给大家分发碗筷、倒饮料，夸她是“贴心小棉袄”。",
        category: Category.PARENTING,
        allergenName: "服务者角色的早期社会化",
        allergenLevel: AllergenLevel.MILD,
        analysis: "通过赞美来强化女孩的“照顾者”身份，而同龄男孩往往在旁边玩耍。",
        wittyComment: "小棉袄是用来保暖的，不是用来端茶送水的服务员。"
    },
    {
        id: "par_015",
        content: "女儿想要剪短发，被告知：“女孩子剪短发像什么样子，男不男女不女的。”",
        category: Category.PARENTING,
        allergenName: "性别气质固化",
        allergenLevel: AllergenLevel.MILD,
        analysis: "强制外貌必须符合二元性别标准，压抑孩子的个性表达。",
        wittyComment: "头发长短影响智商吗？还是影响身份证上的性别？"
    },
    {
        id: "par_016",
        content: "儿子想学做饭，奶奶拦着说：“君子远庖厨，以后找个会做饭的老婆就行了。”",
        category: Category.PARENTING,
        allergenName: "生活自理能力的性别剥夺",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "剥夺男性掌握生存技能的机会，同时预设女性必须承担家务劳动。",
        wittyComment: "万一以后老婆出差了，他是打算饿死还是吃外卖吃到破产？"
    },
    {
        id: "par_017",
        content: "亲戚问孩子理想，男孩说想当护士，全场哄堂大笑：“那是女孩子干的活！”",
        category: Category.PARENTING,
        allergenName: "职业性别隔离 / 照料污名",
        allergenLevel: AllergenLevel.MILD,
        analysis: "嘲笑从事照料工作的男性，既贬低了该职业的价值，也限制了男性的职业选择。",
        wittyComment: "救死扶伤不分男女，ICU里的男护士可是抢手货。"
    },
    {
        id: "par_018",
        content: "女儿因为数学题做不出而哭，老师安慰：“没事，女孩子天生逻辑思维弱一点，背书你在行。”",
        category: Category.PARENTING,
        allergenName: "智力宿命论 / 刻板印象威胁",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "老师的权威背书强化了负面刻板印象，容易导致女孩产生习得性无助。",
        wittyComment: "第一位程序员Ada Lovelace要是听到了，棺材板都压不住了。"
    },
    {
        id: "par_019",
        content: "教育男孩要“保护女孩子”，教育女孩要“学会保护自己”。",
        category: Category.PARENTING,
        allergenName: "主体性差异 / 弱者预设",
        allergenLevel: AllergenLevel.MILD,
        analysis: "看似绅士，实则预设女性是弱者、客体，男性是强者、保护者。应该教育所有孩子互相尊重。",
        wittyComment: "不如教育男孩“不要伤害别人”，教育女孩“你有权反击”。"
    },
    {
        id: "par_020",
        content: "家里买了科学实验套装，包装盒上印的全是戴眼镜的小男孩。",
        category: Category.PARENTING,
        allergenName: "隐形营销偏见",
        allergenLevel: AllergenLevel.MILD,
        analysis: "商品包装潜意识传递“科学是男性的领域”的信息。",
        wittyComment: "我就要在盒子上贴个居里夫人的贴纸。"
    },
    {
        id: "par_021",
        content: "亲戚评价青春期的女孩：“长开了，越来越有女人味了，以后肯定很多人追。”",
        category: Category.PARENTING,
        allergenName: "性化凝视 / 婚恋价值导向",
        allergenLevel: AllergenLevel.MILD,
        analysis: "过早地用成人的、性化的眼光审视未成年女性，将其价值导向对异性的吸引力。",
        wittyComment: "她才13岁，比起有没有人追，我更关心她考得好不好。"
    },
    {
        id: "par_022",
        content: "男孩在外面疯跑一身泥回来被夸“有活力”，女孩弄脏裙子被骂“疯丫头，没规矩”。",
        category: Category.PARENTING,
        allergenName: "对探索欲的差异化惩罚",
        allergenLevel: AllergenLevel.MILD,
        analysis: "限制女孩对物理世界的探索，鼓励她们保持“洁净”和“静止”。",
        wittyComment: "洗衣服确实麻烦，但探索世界的快乐值得一身泥。"
    },
    {
        id: "par_023",
        content: "在讨论未来规划时，父母对儿子说“要去大城市闯闯”，对女儿说“离家近点方便互相照应”。",
        category: Category.PARENTING,
        allergenName: "养育期望差异",
        allergenLevel: AllergenLevel.MILD,
        analysis: "鼓励男性向外扩张，通过限制女性的地理流动性来将其留在家庭网络中提供照料。",
        wittyComment: "女儿也有翅膀，不是用来剪断的，是用来飞的。"
    },
    {
        id: "par_024",
        content: "性教育缺失，告诉女孩“要守身如玉”，却不告诉男孩“要尊重同意”。",
        category: Category.PARENTING,
        allergenName: "贞操观 / 责任不对等",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将性道德的压力单方面施加给女性，忽视了对男性的责任教育。",
        wittyComment: "身体是自己的花园，不是待价而沽的玉器。"
    },
    {
        id: "par_025",
        content: "孩子问“为什么也是妈妈上班，回来却是妈妈做饭？”，爸爸回答“因为妈妈做得好吃呀”。",
        category: Category.PARENTING,
        allergenName: "捧杀式剥削",
        allergenLevel: AllergenLevel.MILD,
        analysis: "用赞美掩盖家务分配不公的事实，将责任推卸给“能力”。",
        wittyComment: "爸爸做得不好吃可以练，妈妈也不是天生就是厨神。"
    },
    {
        id: "par_026",
        content: "学校排话剧《白雪公主》，所有女孩都想演公主，没人想演骑士或国王。",
        category: Category.PARENTING,
        allergenName: "角色模范的单一性",
        allergenLevel: AllergenLevel.MILD,
        analysis: "女孩能接触到的叙事中，高光角色往往是“被看”的女性，缺乏拥有权力的女性榜样。",
        wittyComment: "这次我们改剧本，演《白雪女王和她的圆桌骑士》。"
    },
    {
        id: "par_027",
        content: "亲戚看到女孩性格强势、有主见，担忧地说：“这么厉害，以后小心嫁不出去。”",
        category: Category.PARENTING,
        allergenName: "对女性领导力的打压",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将女性的领导力特质（Assertiveness）负面化，认为威胁到了男性在婚姻中的主导地位。",
        wittyComment: "嫁不出去？那是婚姻配不上她，不是她配不上婚姻。"
    },
    {
        id: "par_028",
        content: "男孩喜欢粉色书包，被同学嘲笑是“娘炮”，回家哭着要换黑色的。",
        category: Category.PARENTING,
        allergenName: "色彩霸权 / 恐同欺凌",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "通过羞辱来维护严格的性别界限，粉色被污名化为低等的、女性的。",
        wittyComment: "粉色曾经是贵族的颜色，内心强大的人才敢穿粉色。"
    },
    {
        id: "par_029",
        content: "过年发红包，爷爷偷偷给孙子包了个大的，说：“这是给我们老X家传宗接代的。”",
        category: Category.PARENTING,
        allergenName: "经济资源的代际性别倾斜",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "利用经济手段强化父权继承制，让孩子过早意识到性别带来的特权。",
        wittyComment: "这钱要是带利息的‘买断费’，那我们可不收。"
    },
    {
        id: "par_030",
        content: "妈妈在教训孩子，爸爸在旁边唱红脸：“哎呀算了，妈妈更年期脾气大。”",
        category: Category.PARENTING,
        allergenName: "父职缺位 / 母亲污名化",
        allergenLevel: AllergenLevel.MILD,
        analysis: "父亲通过拆台母亲来建立“好爸爸”形象，同时用生理词汇攻击女性情绪。",
        wittyComment: "教育需要统一战线，而且‘更年期’不是骂人的脏话。"
    }
];

export const STATIC_SCENARIOS_FEMALE: Scenario[] = [
    // --- WORKPLACE (职场) ---
    {
        id: "wp_001",
        content: "面试官看了看你的简历，微笑着问：“你这个年纪，应该近两年打算要孩子了吧？这对工作强度可能有影响。”",
        category: Category.WORKPLACE,
        allergenName: "母职惩罚 (Motherhood Penalty)",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "这是典型的职场性别歧视。面试官假设女性必然会因为生育而降低工作投入，这种预设不仅违反劳动法，也抹杀了女性的职业价值。",
        wittyComment: "建议反问：‘贵司是对男性员工的陪产假执行得特别好，所以才这么担心吗？’"
    },
    {
        id: "wp_002",
        content: "你在向男同事解释一个技术方案，他打断你说：“其实这个原理很简单，让我来考考你懂不懂...”",
        category: Category.WORKPLACE,
        allergenName: "男性说教 (Mansplaining)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "假设女性不懂专业知识，并在没有被邀请的情况下进行居高临下的解释。",
        wittyComment: "谢谢你的复读机功能，但我刚才是用中文说的。"
    },
    {
        id: "wp_003",
        content: "老板让团队里的女员工负责订奶茶、拿外卖和做会议记录，因为“女孩子比较细心”。",
        category: Category.WORKPLACE,
        allergenName: "办公室家务 (Office Housework)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将低价值的行政琐事默认分配给女性，挤占了她们做核心业务的时间，阻碍职业发展。",
        wittyComment: "我是来当产品经理的，不是来当行政总管的。细心是优点，不是廉价劳动力。"
    },
    {
        id: "wp_004",
        content: "你在表达强烈反对意见时，男同事说：“别这么激动，你是不是那几天来了？”",
        category: Category.WORKPLACE,
        allergenName: "情绪污名化 (Tone Policing)",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将女性的合理愤怒或专业争论归结为生理周期的情绪波动，以此否定其观点的合理性。",
        wittyComment: "我的逻辑和你一样稳定，不需要荷尔蒙来背锅。"
    },
    {
        id: "wp_005",
        content: "为了显得“专业”和“有权威”，你被建议在汇报时要把声音压低，穿深色西装，去掉女性化特征。",
        category: Category.WORKPLACE,
        allergenName: "男性中心主义标准",
        allergenLevel: AllergenLevel.MILD,
        analysis: "默认“专业=男性化气质”，迫使女性为了获得认可而压抑自己的性别特征。",
        wittyComment: "权威来自于能力，而不是声带的振动频率。"
    },
    {
        id: "wp_006",
        content: "团建聚餐时，领导对你说：“小王，你是女生，比较会来事，去给客户敬个酒。”",
        category: Category.WORKPLACE,
        allergenName: "性客体化 / 酒桌文化",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将女性员工视为社交润滑剂或陪衬，利用女性的性别特征来换取商业利益，是对职场人格的矮化。",
        wittyComment: "我比较会来事？那我给客户讲个关于劳动法的笑话助助兴吧。"
    },
    {
        id: "wp_007",
        content: "公司高层会议上，你是唯一的女性。当你提出一个观点时没人理会，十分钟后一个男同事说了同样的话，大家纷纷点头称赞。",
        category: Category.WORKPLACE,
        allergenName: "隐形化 (Hepeating)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "当男性重复女性的观点时才被重视，这种现象被称为'Hepeating'，反映了潜意识里对女性声音的轻视。",
        wittyComment: "谢谢你复述我的观点，很高兴你也同意我十分钟前的看法。"
    },
    {
        id: "wp_008",
        content: "由于你是部门里唯一的女性，大家都默认你会负责照顾办公室的植物和清理微波炉。",
        category: Category.WORKPLACE,
        allergenName: "刻板印象分工",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将家庭领域的照料者角色投射到职场女性身上，默认女性应该承担公共区域的保洁和维护。",
        wittyComment: "怎么，男同事的手是只能用来敲键盘，碰不得抹布吗？"
    },
    {
        id: "wp_009",
        content: "男上司评价你的工作表现时说：“作为女生，你逻辑思维这么强真难得。”",
        category: Category.WORKPLACE,
        allergenName: "好意的性别歧视 (Benevolent Sexism)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "看似夸奖，实则预设了“女生通常逻辑思维差”的偏见。这种“例外论”并没有打破刻板印象，反而强化了它。",
        wittyComment: "作为领导，您这种夸人的方式也挺难得的。"
    },
    {
        id: "wp_010",
        content: "你申请外派常驻机会，HR私下劝你：“那个地方条件艰苦，不太适合女孩子，我们还是优先考虑男员工。”",
        category: Category.WORKPLACE,
        allergenName: "家长式保护 / 机会剥夺",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "打着保护的旗号，剥夺女性接受挑战和晋升的机会。真正的保护是提供安全保障，而不是限制自由。",
        wittyComment: "适不适合由我的能力决定，不由我的性别决定。"
    },
    {
        id: "wp_011",
        content: "晋升名单公布了，比你资历浅、业绩平平的男同事升了职，领导解释说：“他刚买了房，压力大，需要这个机会。”",
        category: Category.WORKPLACE,
        allergenName: "男性养家红利",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "默认男性是家庭经济支柱，因此在资源分配上给予倾斜，而女性的工作被视为“补贴家用”。",
        wittyComment: "我也想买房，我的房贷并不会因为我是女性就打折。"
    },
    {
        id: "wp_012",
        content: "客户来访，进门直接握住男实习生的手叫“王总”，把你当成了秘书。",
        category: Category.WORKPLACE,
        allergenName: "职业身份刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "在潜意识中，领导/专家=男性，辅助/秘书=女性。",
        wittyComment: "看来不仅要看名片，还得看眼科。"
    },
    {
        id: "wp_013",
        content: "公司年会要求女员工穿礼服短裙跳热舞，男员工则只需要穿西装大合唱。",
        category: Category.WORKPLACE,
        allergenName: "企业文化中的性化",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "利用女性员工的身体作为娱乐资源，制造低俗的企业文化。",
        wittyComment: "我是来卖脑子的，不是来卖大腿的。"
    },
    {
        id: "wp_014",
        content: "你在这个项目里负责了最核心的代码，但项目发布会上，只有男主管在台上侃侃而谈，ppt里甚至没你的名字。",
        category: Category.WORKPLACE,
        allergenName: "功劳掠夺 (Bropropriating)",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "女性的劳动成果经常被隐形化，或者归功于团队中的男性领导者。",
        wittyComment: "代码不会说谎，但有些人会。"
    },
    {
        id: "wp_015",
        content: "哺乳期背奶，公司没有母婴室，只能躲在杂物间或卫生间挤奶，还被同事抱怨霸占厕所。",
        category: Category.WORKPLACE,
        allergenName: "职场设施缺失",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "职场环境设计完全忽视了女性的生理需求，排斥职场母亲。",
        wittyComment: "这么大的公司，容不下一张喂养下一代的椅子？"
    },

    // --- RELATIONSHIP (亲密关系) ---
    {
        id: "rel_001",
        content: "伴侣看着你在做家务，说：“老婆辛苦了，我以后会多‘帮’你分担一点的。”",
        category: Category.RELATIONSHIP,
        allergenName: "丧偶式育儿/帮手心态",
        allergenLevel: AllergenLevel.MILD,
        analysis: "使用“帮”这个字，潜台词是家务本该是女性的责任，男性做一点就是恩赐。",
        wittyComment: "这是我们共同的家，你不是在帮我，是在尽你的义务。"
    },
    {
        id: "rel_002",
        content: "你升职加薪了，伴侣的第一反应不是祝贺，而是担心：“你工资比我高，我在朋友面前会很没面子。”",
        category: Category.RELATIONSHIP,
        allergenName: "脆弱的男性自尊",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将男性的自尊建立在“比女性强”的各种指标上，无法接受平等的伴侣关系。",
        wittyComment: "面子是自己挣的，不是靠压低老婆工资换来的。"
    },
    {
        id: "rel_003",
        content: "吵架时，对方说：“你怎么这么不讲理？简直是个疯婆子。”",
        category: Category.RELATIONSHIP,
        allergenName: "煤气灯效应 (Gaslighting)",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "通过贴标签（疯、不理智）来否定女性的感知和记忆，试图操纵现实。",
        wittyComment: "我不讲理是因为讲理对你这种人没用。"
    },
    {
        id: "rel_004",
        content: "出门前，伴侣看了一眼你的衣服说：“这裙子太短了，还是换一件吧，我是怕你在外面吃亏。”",
        category: Category.RELATIONSHIP,
        allergenName: "着装控制 / 荡妇羞辱预警",
        allergenLevel: AllergenLevel.MILD,
        analysis: "打着关心的旗号控制女性的身体展示权，潜意识里认为女性穿着暴露是招致危险的原因。",
        wittyComment: "我会小心的，但我的穿衣自由不需要被'保护'掉。"
    },
    {
        id: "rel_005",
        content: "当你试图和伴侣讨论女性主义话题时，他不耐烦地说：“你们现在地位已经够高了，还要怎样？别搞女拳那一套。”",
        category: Category.RELATIONSHIP,
        allergenName: "对立情绪 / 拒绝沟通",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "拒绝承认性别不平等的现状，并将女性争取权益的行为污名化，这是既得利益者的典型防御机制。",
        wittyComment: "如果你觉得平权就是'拳'，那你可能习惯了站在别人的脖子上。"
    },
    {
        id: "rel_006",
        content: "结婚前，对方家长提出：“我们家传统，希望第一胎能跟爸爸姓，第二胎随你。”",
        category: Category.RELATIONSHIP,
        allergenName: "冠姓权 / 宗族观念",
        allergenLevel: AllergenLevel.MILD,
        analysis: "默认冠姓权属于男性，将女性的冠姓权视为一种退让或协商的产物，而非天赋权利。",
        wittyComment: "既然这么传统，那彩礼是不是也得按清朝的规矩来？"
    },
    {
        id: "rel_007",
        content: "伴侣半开玩笑地说：“你最近是不是胖了？该稍微减减肥了，不然带出去多不好看。”",
        category: Category.RELATIONSHIP,
        allergenName: "身材羞辱 / 装饰品心态",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将女性视为展示给他人看的装饰品（Trophy Wife），对女性身体进行客体化凝视。",
        wittyComment: "带不出去就别带，我又不是你的挂件。"
    },
    {
        id: "rel_008",
        content: "在讨论避孕措施时，伴侣说：“戴套不舒服，反正你吃药也没什么副作用，你就吃药吧。”",
        category: Category.RELATIONSHIP,
        allergenName: "生育责任转嫁 / 身体剥削",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将避孕的健康风险和责任完全推给女性，无视女性的身体健康。",
        wittyComment: "避孕药的副作用说明书比你的借口长多了。"
    },
    {
        id: "rel_009",
        content: "你因为工作忙不想做饭，伴侣抱怨道：“娶个老婆连热乎饭都吃不上，这日子怎么过。”",
        category: Category.RELATIONSHIP,
        allergenName: "刻板印象家务分工",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将'做饭'与'老婆'的角色绑定，认为女性提供家务劳动是婚姻的基础契约。",
        wittyComment: "想吃热乎饭可以去餐厅，或者自己学着开火，我找的是伴侣不是厨师。"
    },
    {
        id: "rel_010",
        content: "伴侣在社交场合公开贬低你的爱好，说：“她平时就喜欢弄些没用的花花草草，不像我做正事。”",
        category: Category.RELATIONSHIP,
        allergenName: "伴侣贬低 / 价值抹杀",
        allergenLevel: AllergenLevel.MILD,
        analysis: "通过贬低伴侣的兴趣来抬高自己的价值，建立关系中的优越感。",
        wittyComment: "我的快乐不是为了向你证明有用没用。"
    },
    {
        id: "rel_011",
        content: "你在看书，伴侣在那边打游戏喊你：“帮我倒杯水”、“帮我拿个外卖”、“袜子在哪”，完全把你当成了智能音箱。",
        category: Category.RELATIONSHIP,
        allergenName: "巨婴行为 / 伺候者角色",
        allergenLevel: AllergenLevel.MILD,
        analysis: "在亲密关系中退化为儿童状态，期待女性像母亲一样提供无微不至的照顾。",
        wittyComment: "我是你女朋友，不是你妈，也不是Siri。"
    },
    {
        id: "rel_012",
        content: "你表达性需求时，伴侣表现得很惊讶甚至有点反感：“女孩子怎么能这么主动，感觉怪怪的。”",
        category: Category.RELATIONSHIP,
        allergenName: "荡妇羞辱 / 贞操观",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "否认女性的性主体性，认为女性在性关系中只能是被动接受者，主动表达欲望被视为不洁。",
        wittyComment: "我有欲望说明我身体健康，你不想做可以直说，不用上价值。"
    },
    {
        id: "rel_013",
        content: "伴侣经常翻看你的手机，要求你汇报行踪，理由是“因为太爱你了，怕失去你”。",
        category: Category.RELATIONSHIP,
        allergenName: "控制型人格 / 亲密关系暴力前兆",
        allergenLevel: AllergenLevel.TOXIC,
        analysis: "将控制欲包装成爱，侵犯个人隐私边界。这是不健康关系的典型信号。",
        wittyComment: "这不是爱，是监视。我有隐私权，也有离开的自由。"
    },
    {
        id: "rel_014",
        content: "过年回谁家的问题上，伴侣理直气壮：“哪有大年三十回娘家的，会被人笑话。”",
        category: Category.RELATIONSHIP,
        allergenName: "嫁娶观念",
        allergenLevel: AllergenLevel.MILD,
        analysis: "“嫁”和“娶”的用词本身就隐含了所有权转移，认为女性婚后属于男方家庭。",
        wittyComment: "大清已经亡了一百年了，醒醒。"
    },

    // --- FAMILY (家庭) ---
    {
        id: "fam_001",
        content: "过年聚餐，长辈对单身的你说：“女孩子太强势了不好，读那么多书，工作再好不如嫁得好。”",
        category: Category.FAMILY,
        allergenName: "婚恋焦虑 & 传统性别分工",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将女性的价值单一绑定在婚姻市场上，忽视个人成就和智力发展。",
        wittyComment: "那您觉得在这个桌上，谁嫁得最好？"
    },
    {
        id: "fam_002",
        content: "弟弟结婚需要买房，父母暗示你应该出钱：“你是姐姐，以后也是泼出去的水，帮衬弟弟是应该的。”",
        category: Category.FAMILY,
        allergenName: "扶弟魔现象 / 资源分配不公",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "在家庭资源分配中重男轻女，却在家庭责任中要求女性无私奉献。",
        wittyComment: "既然我是泼出去的水，那这水费谁来结一下？"
    },
    {
        id: "fam_003",
        content: "家庭聚会结束，男人们坐在沙发上喝茶聊天，女人们在厨房洗碗收拾。",
        category: Category.FAMILY,
        allergenName: "隐形家务劳动",
        allergenLevel: AllergenLevel.MILD,
        analysis: "这种场景在许多家庭中被视为理所当然，反映了根深蒂固的'男主外女主内'和男性在家庭中的特权地位。",
        wittyComment: "看来沙发上长了刺，只有男人皮厚坐得住。"
    },
    {
        id: "fam_004",
        content: "父母经常对你说：“女孩子不要跑太远，就在老家考个公务员，安稳最重要。”",
        category: Category.FAMILY,
        allergenName: "女性发展设限",
        allergenLevel: AllergenLevel.MILD,
        analysis: "社会倾向于规训女性追求'安稳'而非'成就'，限制了女性探索世界和实现野心的可能性。",
        wittyComment: "安稳是留给老人的，我还年轻，想去风浪里搏一搏。"
    },
    {
        id: "fam_005",
        content: "得知你不想生孩子，亲戚苦口婆心：“不生孩子的女人是不完整的，老了你会后悔的。”",
        category: Category.FAMILY,
        allergenName: "生育强制 / 母职神话",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将女性的生命意义等同于生育工具，否认女性作为独立个体的价值。",
        wittyComment: "我很完整，我有头脑、有四肢、有梦想，不需要生个孩子来填补。"
    },
    {
        id: "fam_006",
        content: "表弟成绩不好，长辈说：“男孩子开窍晚，到了高中后劲足。”你成绩好，长辈说：“女孩子小学初中行，到了高中就学不动数理化了。”",
        category: Category.FAMILY,
        allergenName: "智力刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "用伪科学的理论贬低女性的智力潜力，为男性的懒惰找借口，打击女孩的自信心。",
        wittyComment: "看来智力也是传男不传女的隐性基因？"
    },
    {
        id: "fam_007",
        content: "遗产分配时，父母把房子留给了哥哥，把首饰留给了你，并说：“手心手背都是肉，但房子得留给自家人。”",
        category: Category.FAMILY,
        allergenName: "继承权歧视",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "赤裸裸的宗族观念，默认女儿终将是“外人”，剥夺女性平等的财产继承权。",
        wittyComment: "法律规定继承权男女平等，看来咱们家的家法比国法还大。"
    },
    {
        id: "fam_008",
        content: "你升职加薪回家报喜，父母的第一反应是：“工作这么忙，以后怎么顾家？别累坏了身子。”",
        category: Category.FAMILY,
        allergenName: "家庭本位规训",
        allergenLevel: AllergenLevel.MILD,
        analysis: "相比于职业成就，家庭和社会更看重女性的身体健康和家庭照料功能。",
        wittyComment: "我有能力平衡，或者我有能力请人帮忙平衡。"
    },
    {
        id: "fam_009",
        content: "全职妈妈带孩子很累，丈夫回家却说：“你在家呆了一天有什么好累的，我上班才辛苦。”",
        category: Category.FAMILY,
        allergenName: "无偿劳动贬低",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "完全无视家务劳动和育儿劳动的巨大价值，认为只有赚取工资的工作才叫工作。",
        wittyComment: "那你明天请假在家带一天试试，我付你双倍工资。"
    },
    {
        id: "fam_010",
        content: "家族修族谱，规定只有男丁能入谱，或者女儿只能写在配偶旁边。",
        category: Category.FAMILY,
        allergenName: "宗族除名 / 历史抹除",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "在象征家族延续的文本中抹除女性的独立存在，将女性视为附属品。",
        wittyComment: "这种族谱不进也罢，我自己就是我的族谱第一代。"
    },
    {
        id: "fam_011",
        content: "春节回家，妈妈在厨房忙得脚不沾地，爸爸在外面打牌，你进去帮忙，妈妈说：“去叫你哥来端菜。”结果哥哥说：“君子远庖厨。”",
        category: Category.FAMILY,
        allergenName: "家务豁免权",
        allergenLevel: AllergenLevel.MILD,
        analysis: "男性用传统糟粕文化作为逃避家务劳动的借口，而女性则默许了这种特权。",
        wittyComment: "孟子说这句话是因为不忍心看杀生，你是连端个盘子都于心不忍吗？"
    },
    {
        id: "fam_012",
        content: "父母催婚的理由是：“你现在年纪大了，再不嫁人就贬值了，好男人都被挑走了。”",
        category: Category.FAMILY,
        allergenName: "物化女性 / 剩余价值论",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将女性比作商品，认为价值随年龄增长而降低，完全无视人的成长和阅历价值。",
        wittyComment: "我是人，不是超市里打折的临期食品。"
    },

    // --- SOCIAL (社会舆论) ---
    {
        id: "soc_001",
        content: "看到女司机出了小事故，路人评论：“果然是女司机，马路杀手。”",
        category: Category.SOCIAL,
        allergenName: "群体归因错误",
        allergenLevel: AllergenLevel.MILD,
        analysis: "男性出事故是个体原因，女性出事故则归结为性别原因。统计数据显示男性司机的事故率更高。",
        wittyComment: "保险公司的数据表可不这么认为。"
    },
    {
        id: "soc_002",
        content: "新闻报道强奸案，评论区在讨论受害者当晚穿了什么，为什么大半夜还在外面。",
        category: Category.SOCIAL,
        allergenName: "受害者有罪论 (Victim Blaming)",
        allergenLevel: AllergenLevel.TOXIC,
        analysis: "将犯罪责任转移到受害者身上，为施暴者开脱，制造女性恐惧。",
        wittyComment: "强奸犯犯罪的唯一原因是强奸犯本身，不是裙子的长度。"
    },
    {
        id: "soc_003",
        content: "你在网上发布了一张素颜照，有人评论：“虽然很有才华，但作为女生还是要化个妆，注意下形象。”",
        category: Category.SOCIAL,
        allergenName: "美役 (Beauty Duty)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "认为女性有义务时刻保持“赏心悦目”，将女性的外貌置于能力之上。",
        wittyComment: "我发照片是为了记录生活，不是为了取悦你的眼球。"
    },
    {
        id: "soc_004",
        content: "看到女性在公共场合哺乳，有人投来厌恶的目光并拍照发到网上指责“不文明”。",
        category: Category.SOCIAL,
        allergenName: "母职羞辱 / 身体管制",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将自然的哺乳行为色情化或视为不洁，排斥女性在公共空间的正当权利。",
        wittyComment: "如果不文明，请您先把眼睛闭上，别盯着看。"
    },
    {
        id: "soc_005",
        content: "一位女科学家获得了重大奖项，媒体报道标题却是：《兼顾家庭与事业的美女学霸，两个孩子的妈妈》",
        category: Category.SOCIAL,
        allergenName: "成就边缘化 / 家庭捆绑",
        allergenLevel: AllergenLevel.MILD,
        analysis: "在报道成功女性时，过度关注其外貌和家庭角色，而非其专业成就，这是对女性专业性的消解。",
        wittyComment: "还没见过哪个男科学家获奖标题是《顾家的帅气奶爸》。"
    },
    {
        id: "soc_006",
        content: "女性去买卫生巾，收银员会特意用黑色塑料袋包装，仿佛这是什么见不得人的东西。",
        category: Category.SOCIAL,
        allergenName: "月经羞耻 (Period Shaming)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将正常的生理现象污名化为不洁、隐私，加深了女性对自己身体的厌恶感。",
        wittyComment: "这是卫生用品，不是违禁品，不用搞得像地下交易。"
    },
    {
        id: "soc_007",
        content: "某化妆品广告宣传语：“女人不美，地位不稳；没有丑女人，只有懒女人。”",
        category: Category.SOCIAL,
        allergenName: "容貌焦虑贩卖",
        allergenLevel: AllergenLevel.MILD,
        analysis: "通过制造恐慌来推销产品，将女性的社会地位与外貌挂钩，并指责女性不够努力。",
        wittyComment: "我的地位靠实力稳，不是靠涂脂抹粉稳。"
    },
    {
        id: "soc_008",
        content: "在公共交通上，男性随意地张开双腿占据两个座位（Manspreading），挤占了旁边女性的空间。",
        category: Category.SOCIAL,
        allergenName: "大爷式占座 (Manspreading)",
        allergenLevel: AllergenLevel.MILD,
        analysis: "男性在公共空间中习惯性地占据更多地盘，显示出一种对自己身体权利的过度自信和对他人的无视。",
        wittyComment: "您的腿是需要散热，还是中间有什么不可告人的秘密武器？"
    },
    {
        id: "soc_009",
        content: "视频里女生在健身房举铁，评论区：“练成这样太壮了，嫁不出去了。”",
        category: Category.SOCIAL,
        allergenName: "身体规训 / 白幼瘦审美",
        allergenLevel: AllergenLevel.MILD,
        analysis: "用单一的、虚弱的审美标准来规训女性身体，否定女性的力量感。",
        wittyComment: "我练肌肉是为了能一拳打爆偏见，不是为了嫁人。"
    },
    {
        id: "soc_010",
        content: "称呼女医生为“美女医生”，称呼女博士为“女博士”，而对男性则直接称“医生”、“博士”。",
        category: Category.SOCIAL,
        allergenName: "性别标记 / 专业性消解",
        allergenLevel: AllergenLevel.MILD,
        analysis: "在专业称谓前强加性别或外貌标签，暗示女性在这些领域是例外或不够专业。",
        wittyComment: "请叫我医生，我的执照上没写性别。"
    },
    {
        id: "soc_011",
        content: "电视剧里的女高管总是单身、神经质、甚至恶毒，最终结局是“回归家庭”才获得幸福。",
        category: Category.SOCIAL,
        allergenName: "大众传媒的刻板叙事",
        allergenLevel: AllergenLevel.MILD,
        analysis: "媒体反复强化“职业成功=家庭失败”的叙事，恐吓女性不要过度追求事业。",
        wittyComment: "编剧是不是对成功女性有什么误解？"
    },
    {
        id: "soc_012",
        content: "在网络游戏中，女性玩家如果玩得好，被认为是“代打”或“人妖”；如果玩得不好，被认为是“女司机”。",
        category: Category.SOCIAL,
        allergenName: "网络空间的性别排斥",
        allergenLevel: AllergenLevel.MILD,
        analysis: "默认技术/游戏领域是男性的地盘，女性被视为入侵者或不合格者。",
        wittyComment: "电子竞技没有性别，只有菜和不菜。"
    }
];

export const STATIC_SCENARIOS_MALE: Scenario[] = [
    // --- WORKPLACE (职场 - 男性) ---
    {
        id: "m_wp_01",
        content: "你申请了育儿假想多陪陪刚出生的孩子，男上司却开玩笑说：“怎么，要回家当奶爸啊？这种事让老婆做不就行了，男人事业为重。”",
        category: Category.WORKPLACE,
        allergenName: "有毒男子气概 / 照料污名",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "社会默认男性不该承担照料责任，申请育儿假的男性常被视为“缺乏事业心”或“软弱”，剥夺了男性回归家庭的权利。",
        wittyComment: "孩子也是我生的，怎么照顾孩子就成了“帮忙”？"
    },
    {
        id: "m_wp_02",
        content: "办公室需要搬运重物，所有人都自然地看向你和另外几个男同事，女同事则坐在一边聊天。没人问过你的腰是否有旧伤。",
        category: Category.WORKPLACE,
        allergenName: "工具人属性 / 身体剥削",
        allergenLevel: AllergenLevel.MILD,
        analysis: "基于性别的劳动分工，默认男性必须承担重体力劳动，忽视了男性的身体状况和个人意愿，将男性工具化。",
        wittyComment: "我的肌肉是为了健康练的，不是为了当免费搬运工。"
    },
    {
        id: "m_wp_03",
        content: "你作为护士/幼师入职，家长们总是用怀疑的眼光看你，甚至要求换个“细心点的女老师”。",
        category: Category.WORKPLACE,
        allergenName: "职业性别隔离",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "认为男性不具备“细心”、“温柔”等特质，不适合从事照料类工作。这不仅歧视男性，也固化了照料工作低价值的印象。",
        wittyComment: "专业能力看的是证书和经验，不是看染色体。"
    },
    {
        id: "m_wp_04",
        content: "公司裁员，领导暗示女同事因为有家庭负担需要保护，而你是单身男性，抗压能力强，所以把你列入名单。",
        category: Category.WORKPLACE,
        allergenName: "反向性别歧视 / 强者预设",
        allergenLevel: AllergenLevel.MILD,
        analysis: "预设男性天生强大、不需要保护，忽视了男性个体的脆弱性和经济需求。",
        wittyComment: "抗压能力强不代表我就该被牺牲。"
    },
    {
        id: "m_wp_05",
        content: "在需要应酬喝酒的场合，如果你拒绝喝酒，会被嘲笑“是不是男人”，甚至影响职业晋升。",
        category: Category.WORKPLACE,
        allergenName: "霸权男性气质 / 社交胁迫",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "通过逼迫饮酒来测试服从性和“男子气概”，这是一种有毒的职场文化。",
        wittyComment: "我的肝是用来排毒的，不是用来表忠心的。"
    },

    // --- RELATIONSHIP (亲密关系 - 男性) ---
    {
        id: "m_rel_01",
        content: "第一次约会结账时，对方完全没有掏钱包的意思，理所当然地等着你买单。",
        category: Category.RELATIONSHIP,
        allergenName: "供养者刻板印象",
        allergenLevel: AllergenLevel.MILD,
        analysis: "父权制要求男性扮演“供养者”角色，将金钱付出作为衡量男性诚意和能力的唯一标准，这是对男性的物化。",
        wittyComment: "无论是AA还是请客，都应该是出于意愿，而不是出于“我是男人”的义务。"
    },
    {
        id: "m_rel_02",
        content: "你因工作压力大在伴侣面前流泪，她却有些不知所措甚至反感：“你怎么像个女的一样哭哭啼啼的，男人点行不行？”",
        category: Category.RELATIONSHIP,
        allergenName: "情感压抑 / 男儿有泪不轻弹",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "严厉禁止男性表达脆弱和悲伤，要求男性时刻保持“坚强”的假象，这是导致男性心理健康问题的重要原因。",
        wittyComment: "我有泪腺，我有情绪，我是人，不是没有感情的赚钱机器。"
    },
    {
        id: "m_rel_03",
        content: "伴侣要求你必须有房有车才能结婚，并表示：“男人没房就是没能力，我怎么能嫁给你受苦？”",
        category: Category.RELATIONSHIP,
        allergenName: "婚姻工具化 / 成功学绑架",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将男性的价值单一绑定在经济能力上，忽视了情感连接和个人品质，男性成为了婚姻市场上的资产包。",
        wittyComment: "婚姻是两个人的共同建设，不是找个长期饭票。"
    },
    {
        id: "m_rel_04",
        content: "你喜欢做饭、做家务，伴侣却对此不以为然，甚至在朋友面前说你“没出息、胸无大志”。",
        category: Category.RELATIONSHIP,
        allergenName: "家庭角色贬低",
        allergenLevel: AllergenLevel.MILD,
        analysis: "认为男性只有在外部世界（职场）的成功才算成功，贬低男性在家庭内部的贡献。",
        wittyComment: "把家照顾好也是一种能力，不比写PPT容易。"
    },
    {
        id: "m_rel_05",
        content: "你被伴侣扇了一巴掌，周围人却当笑话看，说“打是亲骂是爱，男的皮糙肉厚怕什么”。",
        category: Category.RELATIONSHIP,
        allergenName: "男性受害者忽视",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "社会普遍忽视女性对男性的家庭暴力，甚至将其娱乐化、合理化。",
        wittyComment: "暴力就是暴力，无论施暴者性别如何，都不该被容忍。"
    },

    // --- FAMILY (家庭 - 男性) ---
    {
        id: "m_fam_01",
        content: "你想辞职在家做全职爸爸，父母激烈反对：“大男人在家带孩子，说出去我们要被人笑死！吃软饭没出息！”",
        category: Category.FAMILY,
        allergenName: "性别角色规训",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "父权制贬低家庭劳动的价值，认为只有在公共领域（职场）获得成功的男性才有价值，否定了男性选择生活方式的自由。",
        wittyComment: "带孩子是世界上最艰难也是最伟大的工作，怎么就成了没出息？"
    },
    {
        id: "m_fam_02",
        content: "小时候你喜欢玩洋娃娃，父亲愤怒地把玩具扔掉：“不许玩这种娘娘腔的东西，给我去玩枪！”",
        category: Category.FAMILY,
        allergenName: "阳刚焦虑 / 阴柔羞辱",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "对男性气质的严格监管，恐惧任何与“女性化”沾边的特质，剥夺了男孩探索多元兴趣的机会。",
        wittyComment: "玩具没有性别，暴力也不是男人的必修课。"
    },
    {
        id: "m_fam_03",
        content: "作为家里的长子，父母从小就告诉你：“你是哥哥，你是男子汉，要让着妹妹，以后要撑起这个家。”",
        category: Category.FAMILY,
        allergenName: "长子责任 / 情感忽视",
        allergenLevel: AllergenLevel.MILD,
        analysis: "过早地将家庭重担压在男孩身上，要求其牺牲自我需求去照顾他人，却往往忽视了男孩自己的情感需求。",
        wittyComment: "我也是个孩子，我也需要被照顾，而不是生来就是家庭的顶梁柱。"
    },
    {
        id: "m_fam_04",
        content: "你不想买房，想租房生活去环游世界，父母痛斥你：“不买房怎么娶媳妇？怎么传宗接代？你对得起列祖列宗吗？”",
        category: Category.FAMILY,
        allergenName: "传宗接代枷锁",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "将男性视为家族血脉延续的工具，忽视个人的人生追求。",
        wittyComment: "我家是有皇位要继承吗？我的人生属于我自己。"
    },
    {
        id: "m_fam_05",
        content: "你遭遇了挫折在家里哭，母亲说：“这点小事就哭，以后怎么做大事？把眼泪憋回去。”",
        category: Category.FAMILY,
        allergenName: "情感阉割",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "通过切断男性的情感表达通道，培养冷漠、坚硬的“男子汉”，代价是心理健康的受损。",
        wittyComment: "哭是释放压力的方式，憋着才会憋出病来。"
    },

    // --- SOCIAL (社会 - 男性) ---
    {
        id: "m_soc_01",
        content: "你独自带着女儿在公园玩，旁边的家长投来警惕的目光，甚至有人窃窃私语怀疑你是人贩子或恋童癖。",
        category: Category.SOCIAL,
        allergenName: "男性育儿污名化",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "社会普遍认为男性是潜在的加害者，导致真心参与育儿的男性面临巨大的信任危机和社会排斥。",
        wittyComment: "我是她爸爸，不是罪犯。请停止你们的恶意揣测。"
    },
    {
        id: "m_soc_02",
        content: "遇到危险情况（如火灾演习），大家默认“女士优先”，期待你最后撤离或挺身而出，因为你是男人。",
        category: Category.SOCIAL,
        allergenName: "男性可消耗性 (Male Disposability)",
        allergenLevel: AllergenLevel.TOXIC,
        analysis: "在传统观念中，男性的生命价值往往被认为低于女性和儿童，男性被期待为了保护他人而牺牲自己。",
        wittyComment: "生命是平等的，勇敢是美德，但不是性别义务。"
    },
    {
        id: "m_soc_03",
        content: "你出门打遮阳伞或涂防晒霜，被朋友嘲笑：“你是娘炮吗？大男人怕什么晒。”",
        category: Category.SOCIAL,
        allergenName: "外貌规训 / 恐同",
        allergenLevel: AllergenLevel.MILD,
        analysis: "将自我护理行为与“女性化”挂钩，并通过羞辱（通常带有恐同色彩）来维护狭隘的男子气概。",
        wittyComment: "紫外线致癌可不分男女，我这是相信科学。"
    },
    {
        id: "m_soc_04",
        content: "在社交场合，如果你不喝酒、不抽烟、不讲黄色笑话，就会被认为“不合群”或“不像个男人”。",
        category: Category.SOCIAL,
        allergenName: "有毒社交文化",
        allergenLevel: AllergenLevel.MILD,
        analysis: "男性社交圈常通过不良行为来确认彼此的身份认同，这种“兄弟会文化”排斥了那些温和、健康的男性。",
        wittyComment: "如果这就叫“像个男人”，那我宁愿做个健康的人。"
    },
    {
        id: "m_soc_05",
        content: "当你讨论自己的心理健康问题或抑郁症时，被告知：“男人要坚强，别像个林黛玉一样无病呻吟。”",
        category: Category.SOCIAL,
        allergenName: "心理求助羞耻",
        allergenLevel: AllergenLevel.SEVERE,
        analysis: "社会阻止男性寻求心理帮助，导致男性自杀率在很多国家远高于女性。",
        wittyComment: "生病看医生是常识，心理生病也一样。"
    },
    {
        id: "m_soc_06",
        content: "你个子不高，在相亲市场上被一票否决，被称为“半残”。",
        category: Category.SOCIAL,
        allergenName: "身高歧视 / 身体羞辱",
        allergenLevel: AllergenLevel.MILD,
        analysis: "身高成为衡量男性吸引力甚至价值的核心指标，这种身体羞辱对男性自信心造成巨大打击。",
        wittyComment: "浓缩的都是精华，拿破仑也不高。"
    }
];
