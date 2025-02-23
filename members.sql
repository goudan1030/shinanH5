-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2025-02-23 14:56:40
-- 服务器版本： 5.7.44-log
-- PHP 版本： 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `h5_cloud_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `members`
--

CREATE TABLE `members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `member_no` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_area` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `education` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `house_car` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hukou_province` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hukou_city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `children_plan` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriage_cert` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `self_description` text COLLATE utf8mb4_unicode_ci,
  `partner_requirement` text COLLATE utf8mb4_unicode_ci,
  `remaining_matches` int(11) DEFAULT '0',
  `success_time` datetime DEFAULT NULL,
  `success_reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `wechat` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `marriage_history` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexual_orientation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `members`
--

INSERT INTO `members` (`id`, `member_no`, `type`, `status`, `province`, `city`, `district`, `gender`, `target_area`, `birth_year`, `height`, `weight`, `education`, `occupation`, `house_car`, `hukou_province`, `hukou_city`, `children_plan`, `marriage_cert`, `self_description`, `partner_requirement`, `remaining_matches`, `success_time`, `success_reason`, `created_at`, `updated_at`, `wechat`, `phone`, `marriage_history`, `sexual_orientation`, `nickname`, `deleted`) VALUES
(1, '10057', 'NORMAL', 'ACTIVE', '上海市', '浦东新区', '浦东新区', 'male', '江浙沪', 1989, 174, 64, 'MASTER', '金融行业', 'HOUSE_ONLY', '江苏省', '江苏省', 'BOTH', 'NEGOTIATE', '江苏人在上海，真诚善良，外表可以，希望成为互助的朋友', '江苏人在上海，真诚善良，外表可以，希望成为互助的朋友', 0, NULL, NULL, '2024-12-26 07:46:57', '2025-02-07 12:46:52', 'cytad29', NULL, NULL, NULL, '互助圈登记用户', 0),
(2, '10060', 'NORMAL', 'REVOKED', '上海市', '上海市', '闵行区', 'female', '上海地区', 1992, 162, 58, 'MASTER', '体制内工作', 'CAR_ONLY', NULL, NULL, 'NONE', 'WANT', '不要小孩，需要领证，未来无工作上需求了可办离。寻找范围在上海地区的合作伙伴（若男方未来有生育需要，可办离后解决个人诉求）。\n\n【希望的男方形象】希望品行端正，真诚靠谱，有稳定的对象。沟通需求方面坦诚直爽，互相理解，有共同的诉求。', '需要伙伴上海有房或者已准备好购房首付等上海购房条件（不需加女方姓名，但需应对父母要求，父母婚后偶尔可能会来上海家中探访时有房使用）。经济上不往来，彩礼走个形式，私下归还，需要上海办一个精简的仪式，费用按桌数各自负责。\n\n双方经济独立，有需要时一起配合应对父母朋友，女方这边偶尔会有朋友聚餐需要配合出席，次数不多。家庭关系简单，希望对方圈子简单，家庭背景简单，目标需求一致。\n\n是否同住：希望男方有房（无需加女方姓名），婚后有房间偶尔应付父母。日常情况下各自和对象住在一起。', 1, NULL, NULL, '2024-12-16 07:00:21', '2025-02-07 12:46:52', 'PLatot4', NULL, NULL, NULL, '互助圈登记用户', 0),
(3, '10086', 'NORMAL', 'ACTIVE', '湖南省', '长沙市', NULL, 'female', '长沙地区', 1985, 160, 59, 'BACHELOR', '央企', 'HOUSE_ONLY', NULL, NULL, 'BOTH', 'WANT', '长沙,女,85年,就职央企,工作稳定,无不良嗜好,不混圈,鉴于亲朋好友的压力,拟寻有缘人,\n希望您同样对合作有认真的考虑,在日后相处中彼此配合、互助。', '已定居或即将定居长沙或周边和我年龄相仿（小一点大一点都可）,身高175以上,从事正当职业,有稳定收入,身体健康,能孝顺父母,必要的时候互相帮助应付家人,虽是，但从长远考虑希望你的父母通情达理，可以像家人一样相处.\nPS:做给亲朋看,结婚流程照走.', 1, NULL, NULL, '2024-12-16 07:01:41', '2025-02-07 12:46:52', 'LY1024YL', NULL, NULL, NULL, '互助圈登记用户', 0),
(4, '10119', 'NORMAL', 'ACTIVE', '山东省', '威海市', NULL, 'female', '威海及周边地区', NULL, 173, 61, 'BACHELOR', '部门经理', 'HOUSE_ONLY', NULL, NULL, 'NONE', 'WANT', '有固定朋友，经济独立，', '希望能配合走动家庭关系，稳定职业，性格开朗不混圈，\n\n不要太娘', 1, NULL, NULL, '2024-12-17 01:28:20', '2025-02-07 12:46:52', '365906643', NULL, NULL, NULL, '互助圈登记用户', 0),
(5, '10151', 'NORMAL', 'REVOKED', '广西', '柳州市', NULL, 'female', NULL, NULL, 162, 46, 'BACHELOR', '资料员', 'NEITHER', NULL, NULL, 'NONE', 'NEGOTIATE', '本人身体健康 正当工作 有bf 不抽烟不喝酒不混圈无纹身无不良嗜好（希望你也一样）因与bf都不喜欢小孩 固不接受通过任何形式要小孩 婚后不同住 逢年过节双方有需要可协商走亲戚 ', '希望你28岁以上 身高172以上 学历本科及以上 工作稳定 有住房 最好有bf 柳州人 或在柳工作居住 个人及家人能接受不要小孩 诚心找xh 不诚勿扰', 1, NULL, NULL, '2024-12-17 01:29:05', '2025-02-07 12:46:52', 'BP7097', NULL, NULL, NULL, '互助圈登记用户', 0),
(6, '10167', 'NORMAL', 'ACTIVE', '上海市', '闵行区', NULL, 'female', '上海地区', 1988, 173, 60, 'MASTER', '企业员工', 'HOUSE_ONLY', NULL, NULL, 'BOTH', 'NEGOTIATE', '美国名校硕士毕业，上海企业中层管理人员，求合适的gay合作，生娃。我的家庭不存在很急迫的结婚的压力，更迫切的是如何在合适年龄之前生娃。合作是一个形式，生娃是目的，养育小孩是另一件可能需要跟你探索的事情了，我目前并没有把所有养育问题都想好，因人而异。', '经济条件比我好或者跟我差不多，学历相等，对待合作和生娃的态度一致，对待养育问题，希望你对孩子有责任感，对我们搭建的\"共同体\"也有责任感，对待你和你的真实爱人和孩子她妈，能够找到平衡，所以希望你有稳定的bf，且和你的bf在生育问题上观点一致。\n\n在经济问题上，我和你的财产分别独立，在孩子的生育和养育问题上我们具体商量如何分配比例。我会根据你的条件来平衡到底何种方式对孩子会比较好，我基本不用你来照顾，你只需要投入到娃身上就好', 1, NULL, NULL, '2024-12-17 01:36:35', '2025-02-07 12:46:52', 'ray003', NULL, NULL, NULL, '互助圈登记用户', 0),
(7, '10433', 'NORMAL', 'REVOKED', '天津市', '河东区', NULL, 'female', '天津地区', 1996, 168, 54, 'BACHELOR', '化妆师', 'CAR_ONLY', NULL, NULL, 'NONE', 'DONT_WANT', '天津拉拉找g合作 不证  可以先做朋友接触下', NULL, 1, NULL, NULL, '2024-12-17 01:38:07', '2025-02-07 12:46:52', 'GemkexiN', NULL, NULL, NULL, '互助圈登记用户', 0),
-- 转储表的索引
--

--
-- 表的索引 `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_members_deleted` (`deleted`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `members`
--
ALTER TABLE `members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=849;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
