---
layout: post
tags: 工具
---

## 路由

路由中有以下几种形式

单播：在网络地址和网络节点之间存在一一对应的关系。

任播：根据路由拓扑自动决定送到“最近”或“最好”的目的地

多播：是一种群组通信，它把信息同时传递给一组目的计算机。常指IP多播，组播地址224.0.0.0～224.0.0.255

广播:向指定网络范围内所以设备发送信息，广播地址为255.255.255.255，ARP、DHCP都使用了广播

地域性广播：一种“特殊”的多播

## DNS

Domain Name System,域名服务，将域名和ip地址互相影射的分布式数据库，使用TCP和UDP端口

## mDNS

#### 概念

mDNS主要实现了在没有DNS服务器的情况下使用多播网络使局域网内的主机实现发现和通信，mDNS地址224.0.0.251，默认端口号为5353,使用DNS协议。

#### 原理

若主机开启了mDNS，在进入局域网内时会向224.0.0.251地址发送信息，信息内容包含，ip地址端口号，服务名等；

同时其mDNS服务会向其它mDNS询问获取局域网内的服务。

## 使用mDNS(avahi)

### 安装

在mac os 中常使用Bonjour，在此我们在linux中使用avahi演示

```shell
yum install nss-mDNS avahi avahi-tools -y
```

avahi-tools是avahi的工具包，包含avahi-browse、avahi-publish-address 、 avahi-resolve-host-nameavahi-browse-domains、avahi-publish-service、avahi-set-host-name、avahi-daemon、avahi-resolve、avahi-publish、avahi-resolve-address

常用的avahi-browse的功能如下

```shell
-D --browse-domains  浏览域而不是服务
-a --all             显示所有服务，忽略类型
-d --domain=DOMAIN   要浏览的域
-v --verbose         启用详述模式
-t --terminate       导出一个完整列表后终止
-c --cache           导出缓存中的所有条目后终止
-l --ignore-local    忽略本地服务
-r --resolve         解析找到的服务
-f --no-fail         如果 daemon 不可用也不中断
-p --parsable        输出可解析格式
-k --no-db-lookup    不查询服务类型
-b --dump-db         导出服务类型数据库
```

### 添加服务

创建文件 /etc/avahi/services/wltHello.service

```
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
    <name>wlt@*Hello</name>
    <service>
        <type>_wlt@*Hello._tcp</type>
        <port>5678</port>
    </service>
</service-group>
```

### 重启服务

```shell
systemctl restart dbus
systemctl restart avahi-daemon
```

###　查询服务

```shell
[root@localhost ~]# avahi-browse -vrtp _wlt@*Hello._tcp
+;eth0;IPv4;wlt\064\042Hello;_wlt\064\042Hello._tcp;local
=;eth0;IPv4;wlt\064\042Hello;_wlt\064\042Hello._tcp;local;linux.local;172.20.65.36;5678;
```

通过avahi-browse即可在局域网内通过avahi-browse发现服务

在实际生产中，我们可以在开启服务时同时添加mDNS服务，消费者机器通过avahi-browse查询服务得到开启服务的ip地址，再进一步与服务建立链接。除此之外avahi还暴露了一些api：https://www.avahi.org/doxygen/v0.7/html/index.html
