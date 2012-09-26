
{
	"targets": 
	[
	{

"cflags": 
["-I/usr/local/include -L/usr/local/lib -L. -lLOG -llog4cplus -ldl"],
		
		"target_name": "LOGWrapper",
		"sources": ["LOGWrapper.cpp"],
"libraries": [],

'conditions': [
          ['OS=="linux"', {
'libraries': [
            '-ldl',
          ],

'cflags':[
'-I/usr/local/include -L/usr/local/lib -L. -lLOG -llog4cplus -ldl',
],

'libraries': [
            '-ldl',
          ],
          'include_dirs': [
            'usr/local/include',
       	 ],

            'ldflags': [
              '-LOG',
            ],

          }],
        ],


	}
	]
}


