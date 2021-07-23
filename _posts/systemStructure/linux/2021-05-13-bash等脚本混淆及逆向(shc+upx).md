---
layout: post
tags: linux
---

## shc混淆

### shc安装

从官网下载http://www.datsi.fi.upm.es/~frosal/sources/ (最新2015年的shc-3.8.9b.tgz)，或者源码下载https://github.com/neurobin/shc (有最新的)

```shell
wget http://www.datsi.fi.upm.es/~frosal/sources/shc-3.8.9b.tgz
tar zxvf shc-3.8.9b.tgz
cd shc-3.8.9b
make clean
make test # 等待paused 然后回车
make strings&install # 等待继续输入yes
```

shc命令说明

```shell
    -e %s  Expiration date in dd/mm/yyyy format [none]
    -m %s  Message to display upon expiration ["Please contact your provider"]
    -f %s  File name of the script to compile
    -i %s  Inline option for the shell interpreter i.e: -e
    -x %s  eXec command, as a printf format i.e: exec('%s',@ARGV);
    -l %s  Last shell option i.e: --
    -r     Relax security. Make a redistributable binary
    -v     Verbose compilation
    -D     Switch ON debug exec calls [OFF]
    -T     Allow binary to be traceable [no]
    -C     Display license and exit
    -A     Display abstract and exit
```

### 使用shc给hello world脚本加密

```shell
# 我们先创建一个sh
[root@localhost ~]# echo '#!/bin/bash' > hello.sh;echo "echo hello world" >> hello.sh
[root@localhost ~]# chmod +x hello.sh;./hello.sh
hello world
[root@localhost ~]# shc -f hello.sh
[root@localhost ~]# ./hello.sh.x
hello world
```

我们使用readelf查看发现是elf文件

```shell
[root@172-20-65-67 ~]# readelf -h hello.sh.x 
ELF 头：
  Magic：  7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 
  Class:                             ELF64
  Data:                              2's complement, little endian
  Version:                           1 (current)
  OS/ABI:                            UNIX - System V
  ABI Version:                       0
  Type:                              EXEC (可执行文件)
  Machine:                           Advanced Micro Devices X86-64
  Version:                           0x1
  入口点地址：              0x400d00
  程序头起点：              64 (bytes into file)
  Start of section headers:          9376 (bytes into file)
  标志：             0x0
  本头的大小：       64 (字节)
  程序头大小：       56 (字节)
  Number of program headers:         9
  节头大小：         64 (字节)
  节头数量：         28
  字符串表索引节头： 27
```

### shc简单的原理介绍

我们在使用`shc -f hello.sh`时会发现还生成了一个hello.sh.x.c的文件，阅读c我们知道shc是将脚本用rc4进行加密，然后将加密后的脚本、密钥、解密程序再用c编译成elf文件，在执行elf时再将加密的脚本解密运行。  看了shc的混淆方式，我们也可以用其他编译行语言(例如go、rust、c++)等自己实现，更换加解密算法，甚至不用加解密算法。

### 从shc 可执行文件获取源码(逆向)

1. 使用IDA等反编译工具动态调试，找解密后的函数
2. 使用coredump 从内存读取。
3. 使用一些现有的工具，例如https://github.com/yanncam/UnSHc，新的shc加入了linux内核本身的安全机制，好像不能用了

### 其它

1. 使用gzexe混淆
2.  shc -e 过期时间挺好用的

## 使用upx加壳

### upx安装

从https://github.com/upx/upx 下载源码安装或其他包管理器安装

### upx 演示

在我们刚刚使用shc对helloworld脚本编译生成elf后，我们可以使用upx对此elf进行加壳压缩，也算是一种混淆方式

upx压缩前 11k

```shell
[root@172-20-65-67 ~]# ls -lh ./hello.sh.x
-rwx--x--x. 1 root root 11K 7月  23 10:19 ./hello.sh.x
```

upx 压缩后 6.9k, -9代表压缩等级（1-9,9个等级）

```shell
[root@172-20-65-67 ~]# upx -9 ./hello.sh.x;ls -lh ./hello.sh.x
                       Ultimate Packer for eXecutables
                          Copyright (C) 1996 - 2013
UPX 3.91        Markus Oberhumer, Laszlo Molnar & John Reiser   Sep 30th 2013

        File size         Ratio      Format      Name
   --------------------   ------   -----------   -----------
     11168 ->      7004   62.71%  linux/ElfAMD   hello.sh.x                    

Packed 1 file.
-rwx--x--x. 1 root root 6.9K 7月  23 10:19 ./hello.sh.x
```

我们压缩后的helloworld依然正常运行

```shell
[root@172-20-65-67 ~]# ./hello.sh.x 
hello world
```

### upx原理

对elf文件进行压缩并插入解压代码，在运行时（加载到内存时）解压代码

### 脱壳工具

略
