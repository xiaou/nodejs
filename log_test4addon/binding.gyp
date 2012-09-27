
{
	"targets": 
	[
	{

		
		"target_name": "LOGWrapper",
		"sources": ["LOGWrapper.cpp"],
		'libraries': ["LOG"],


      'direct_dependent_settings': {
        'conditions': [
          ['OS=="linux"', {
            'libraries': [ '-ldl', '../libLOG.a', '-lLOG' ],
          }],
        ],
      },


"libraries": ['../libLOG.a'],

'conditions': [
          ['OS=="linux"', {
			'libraries': [
            '-ldl', '../libLOG.a'
          	],
		  }
		]
	]

}
]
}

