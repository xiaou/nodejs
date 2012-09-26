/*
 * by xiaoU.
 */

#include "LOG.h"

#include <node.h>
#include <v8.h>

#include <stdio.h>

using namespace v8;

extern "C" {

  NODE_MODULE_EXPORT void init(Handle<Object> target);
NODE_MODULE_EXPORT Handle<Value> func1(const Arguments& args);
NODE_MODULE_EXPORT Handle<Value> func2(const Arguments& args);


Handle<Value> func1(const Arguments& args)
{
	HandleScope scope;
	
printf("this is printf()\n");
	LOG_DEBUG("xxoo~~");

	return scope.Close(String::New("func-1"));
}

Handle<Value> func2(const Arguments& args)
{
	HandleScope scope;
	
	return scope.Close(String::New("func2"));
}

void init(Handle<Object> target)
{
	target->Set(String::NewSymbol("func1"),
		FunctionTemplate::New(func1)->GetFunction());
	target->Set(String::NewSymbol("func2"),
		FunctionTemplate::New(func2)->GetFunction());
}

NODE_MODULE(LOGWrapper, init);

}






