# -*- coding: utf-8 -*-
import os
import sys
import time
import json
import sys  
  
reload(sys)  
sys.setdefaultencoding('utf8')

CACHE_MAP_DATA_PATH = '/usr/share/nginx/html/s/influenza/influenza_data.json'

PROVINCE_MAP = {
		u'上海市': 'cn-sh',
		u'浙江省': 'cn-zj',
		u'澳门': 'cn-3681',
		u'福建省': 'cn-fj',
		u'广东省': 'cn-gd',
		u'云南省': 'cn-yn',
		u'西藏自治区': 'cn-xz',
		u'宁夏回族自治区': 'cn-nx',
		u'陕西省': 'cn-sa',
		u'安徽省': 'cn-ah',
		u'湖北省': 'cn-hu',
		u'重庆市': 'cn-cq',
		u'湖南省': 'cn-hn',
		u'北京市': 'cn-bj',
		u'河北省': 'cn-hb',
		u'山东省': 'cn-sd',
		u'天津市': 'cn-tj',
		u'海南省': 'cn-ha',
		u'吉林省': 'cn-jl',
		u'青海省': 'cn-qh',
		u'新疆维吾尔自治区': 'cn-xj',
		u'内蒙古自治区': 'cn-nm',
		u'黑龙江省': 'cn-hl',
		u'四川省': 'cn-sc',
		u'贵州省': 'cn-gz',
		u'广西壮族自治区': 'cn-gx',
		u'辽宁省': 'cn-ln',
		u'江苏省': 'cn-js',
		u'甘肃省': 'cn-gs',
		u'山西省': 'cn-sx',
		u'河南省': 'cn-he',
		u'江西省': 'cn-jx'
	}

def cmd_to_str(cmd, default_res = '{}'):
    try:
        print cmd
        output = os.popen(cmd)
        return output.read()
    except Exception, err:
        print err
        return default_res

def write_cache_file(path, json_data):
    with open(path, 'w') as f:
        json.dump(json_data, f)

def parse_overview(origin_html):
	origin_overview_str = origin_html.split('window.getAreaStat =')[1].split('}catch(e){')[0]
	overview_list = json.loads(origin_overview_str)
	map_data = []
	overview = []
	for item in overview_list:
		province = item['provinceName']
		provinceConfirmedCount = item['confirmedCount']
		provinceSuspectedCount = item['suspectedCount']
		provinceCuredCount = item['curedCount']
		provinceDeadCount = item['deadCount']
		cities = item['cities']

		province_key = PROVINCE_MAP.get(province)
		if not province_key:
			print province
		else:
			map_data.append({
				'key': province_key,
				'value': provinceConfirmedCount
			})

		city_data = []
		if not cities or len(cities) == 0:
			print u'> %s 确认：%s 疑似：%s 治愈：%s 死亡：%s' % (province, provinceConfirmedCount, provinceSuspectedCount, provinceCuredCount, provinceDeadCount)
		else:
			for city in cities:
				cityName = city['cityName']
				confirmedCount = city['confirmedCount']
				suspectedCount = city['suspectedCount']
				curedCount = city['curedCount']
				deadCount = city['deadCount']
				city_data.append({
					'city': cityName,
					'confirmed': confirmedCount,
					'suspected': suspectedCount,
					'cured': curedCount,
					'dead': deadCount
					})
				print u'%s %s 确认：%s 疑似：%s 治愈：%s 死亡：%s' % (province, cityName, confirmedCount, suspectedCount, curedCount, deadCount)
		province_data = {
			'province': province,
			'confirmed': provinceConfirmedCount,
			'suspected': provinceSuspectedCount,
			'cured': provinceCuredCount,
			'dead': provinceDeadCount,
			'cities': city_data
		}
		overview.append(province_data)
	cache_data = {
		'map': map_data,
		'overview': overview
	}
	write_cache_file(CACHE_MAP_DATA_PATH, cache_data)

def main():
	cmd = "curl -L 'https://3g.dxy.cn/newh5/view/pneumonia?scene=2&clicktime=1579578460&enterid=1579578460&from=groupmessage&isappinstalled=0'"
	origin_html = cmd_to_str(cmd, '')
	parse_overview(origin_html)

if __name__ == '__main__':
	main()
