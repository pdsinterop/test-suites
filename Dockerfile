FROM dorowu/ubuntu-desktop-lxde-vnc
ENV USER tester
ENV PASSWORD 1234
ENV VNC_PASSWORD 1234
ADD ./ubuntu-init-script.sh /ubuntu-init-script.sh