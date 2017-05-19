# Changelog


## v1.0.0 (2017-05-19)
	* Support for react v15
	* Support anyOf schema definition [Filipe Sousa]
	* Performance improvement using shouldComponentUpdate [feego]
	* Hidden fields [Marc Arbesman]
	* Allowed for support of disabled boolean to be used by checkbox and selection form elements  [Marc Arbesman]
	* Clear unique key warning.
	* submitOnChange prop will no longer supress state update on form  [gabriel]
	* Default validator now validates properties inside oneOf
	* Boolean values are now true/null
	* sectionWrapper now receives functions to reorder arrays
	* Added test suite [#8 bananafunctor]
	* Better array titles
	* sectionWrapper and fieldWrapper props can now receive React Elements [feego]

## v0.2.0 (2015-10-26)

	* Start of this fork from plexus-form
	* plexus-validate and plexus-objective aren't external dependencies from now on.
	* plexus-validate is now used as default. But you can still inject your own validate function
	* new project mantainer, me! \o/ Hello!
