Module to control ebus data

##  Preparation

Please connect your device to the internet

Install NodeJS, if it is not yet
```
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs git make g++ gcc build-essential
```

Install this `wirenboard-mqtt-proxy` to global space
```
npm i -g wirenboard-mqtt-proxy
```

Start the proxy
```
wirenboard-mqtt-proxy start
```

To enable proxy autorun on boot use it
```
wirenboard-mqtt-proxy enable
```

##  Install

To install this packet use `wirenboard-module` command. Install it if necessary
```
npm i -g wirenboard-module
```

Add ebus module and rule
```
wirenboard-module ebus
```

----

Best regards
- **FullHouse team**
- https://fullhouse-online.ru
- support@fullhouse-online.ru
