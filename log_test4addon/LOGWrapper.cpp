/*
 * by xiaoU.
 */

#include "LOG.h"

#include <node.h>
#include <v8.h>

#include <iostream>

using namespace v8;


Handle<Value> func1(const Arguments& args)
{
	HandleScope scope;

std::cout<< testFunc() << std::endl;

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








