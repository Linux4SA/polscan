# polscan

*polscan* (short for "Policy Scanner") 
* Makes your DevOps server configuration/security/automation policies explicit
* Easily detects configuration drift (Puppet 2/3/4)
* Provides details on package updates (Debian, PHP, Gem, CVEs via debsecan)
* Provides basic security checks (SSH, NFS, sysctl)
* Explains policies by
  * linking references
  * having reasonable descriptions
  * suggesting quick fixes
  * referencing to security standards
* Has zero setup, no dependencies: Bash 4.2, SSH
* Scales up to at least 2000 hosts * 50 scanners ~ 100k findings

Policies are implemented by [small shell snippets](http://lzone.de/polscan/) and thus polscan is easily extensible by your own specific policies. To make it easy to use it comes with host discovery solutions for typical automation setups (Chef, Puppet, MCollective).

Features
--------------

Detecting automation issues...

Product     | Host Discovery | Resource Coverage
----------- | -------------- | -----------------
Puppet2/3/4 | y              | Mounts, Users, SSH Keys, ulimit, sysctl, sudoers, 3rd party APT repos, Crons 
Chef        | y              | %
Ansible     | y              | %
SaltStack   | y              | %
Mcollective | y | %

Detecting package issues...

Providers | Detection | Upgrade Check | Error Check | CVE Check
--------- | --------- | ------------- | ----------- | ---------
apt       | %         | yes           | yes
dpkg      | %         | %             | yes         | yes (debsecan)
Gem       | yes       | yes           | 
PECL      | yes       | yes           | 
PIP       | yes       | yes           | 
CPAN      | no         | 
NPM       | no         | 

Collects inventories for

* NTP / DNS Servers
* OS Releases,  Kernel Version
* External IPs, IPv6 Adresses
* 3rd party APT repos used
* CPU-RAM size, CPU type, Server type
* RAID Vendor
...

Graphs network topologies

* TCP Connections
* Remote FS Mounts
* Nginx Upstreams / Apache ProxyPass
* SSH Key Equivalencies
* Network Routes

Provides vulnerabilities statistics per CVE using debsecan.

Screenshots
-----------

*Overview Page*

![screenshot](http://lzone.de/images/polscan-overview.png)

*Host Map per Finding Type*

![screenshot](http://lzone.de/images/polscan-hostmap-group-by-domain.png)

*Visualizing Network Connections*

![screenshot](http://lzone.de/images/polscan-netviews.png)

Note: polscan is intentionally limited to Debian and for simplicity tries not to implement any distro-specific dependencies.

How to run it
-------------

polscan keeps results on a daily basis so it makes sense to set up a daily cron.

Or just run it from the source directory

    ./polscan                          # To re-scan all hosts
    ./polscan -l 'server1 server2'     # To scan specific hosts

Access Results
--------------

For simplicity all results are store in files in plain text and JSON. The JSON files are used by the static HTML viewer that can be used to inspect the result archive.

To quickly expose the static results in any webservers document root run the following commands from the directory you installed polscan into:

    cp -r www /var/www/polscan
    mkdir /var/www/polscan/results
    ln -s /var/www/polscan/results results
