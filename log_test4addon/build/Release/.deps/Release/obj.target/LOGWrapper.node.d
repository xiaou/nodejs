cmd_Release/obj.target/LOGWrapper.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m32  -Wl,-soname=LOGWrapper.node -o Release/obj.target/LOGWrapper.node -Wl,--start-group Release/obj.target/LOGWrapper/LOGWrapper.o -Wl,--end-group ../libLOG.a -ldl
