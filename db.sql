create database if not exists minis default character set utf8;
use minis;

create table cal_user (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
uid varchar(32) not null default '' comment '用户id',
open_id varchar(32) not null default '' comment '微信open_id',
nick varchar(32) not null default '' comment '昵称',
avatar varchar(256) not null default '' comment '头像',
gender tinyint not null default 0 comment '性别，0:未知；1:男；2:女',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
update_time bigint unsigned not null default 0 comment '更新时间，13位',
delete_time bigint unsigned not null default 0 comment '删除时间，13位',
primary key (id),
unique key (uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='账号表';

create table cal_evt_template (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
uid varchar(32) not null default '' comment '用户id',
evt_id varchar(32) not null default '' comment '事件ID',
evt_name varchar(32) not null default '' comment '事件名称',
color char(7) not null default '#F56C6C' comment '颜色',
description varchar(128) not null default '' comment '事件详情',
score float not null default 0 comment '绩效',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
update_time bigint unsigned not null default 0 comment '更新时间，13位',
delete_time bigint unsigned not null default 0 comment '删除时间，13位',
primary key (id),
unique key (uid, evt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='事件模版表';

create table cal_evt (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
dt int unsigned not null default 20190101 comment '日期',
uid varchar(32) not null default '' comment '用户id',
evt_id varchar(32) not null default '' comment '事件ID',
evt_name varchar(32) not null default '' comment '事件名称',
color char(7) not null default '#F56C6C' comment '颜色',
description varchar(128) not null default '' comment '事件详情',
score float not null default 0 comment '绩效',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
update_time bigint unsigned not null default 0 comment '更新时间，13位',
delete_time bigint unsigned not null default 0 comment '删除时间，13位',
primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='事件表';

create table feedback (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
app varchar (16) not null default '' comment 'App',
pt varchar(16) not null default '' comment '平台',
ch varchar(16) not null default '' comment '渠道',
ver varchar(16) not null default '' comment '版本号',
uid varchar(64) not null default '' comment '用户ID',
contract varchar(128) not null default '' comment '联系方式',
content varchar(1024) not null default '' comment '反馈内容',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='反馈表';

create table cal_share (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
applicant_uid varchar (32) not null default '' comment '申请人uid',
owner_uid varchar (32) not null default '' comment '日历所有人的uid',
state tinyint unsigned not null default 0 comment '申请状态：0，申请中；1，申请通过；2，申请被拒绝；3，申请关系已失效',
description_auth tinyint unsigned not null default 0 comment '是否允许别人查看事件的描述信息，0：不允许，1：允许',
score_auth tinyint unsigned not null default 0 comment '是否允许别人查看事件的绩效信息，0：不允许，1：允许',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
update_time bigint unsigned not null default 0 comment '更新时间，13位',
unique key (applicant_uid, owner_uid),
primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='日历分享表';

create table cal_day (
id int unsigned not null AUTO_INCREMENT comment '自增主键',
dt int unsigned not null default 20190101 comment '日期',
--holiday varchar(128) not null default '' comment '节日',
--statutory_holidays tinyint unsigned not null default 0 comment '是否法定假期：0，不是；1，是',
--lunar_cal varchar(16) not null default '' comment '农历',
quote varchar(256) not null default '' comment '语录',
author varchar(64) not null default '' comment '语录作者',
create_time bigint unsigned not null default 0 comment '创建时间，13位',
primary key (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='日历节日表';


