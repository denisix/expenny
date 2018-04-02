App.info({
	id: 'com.denisix.meteor.expenses',
	name: 'Expenses List',
	version: "0.0.1",
	description: 'Get über power in one button click',
	author: 'Denis',
	email: 'john@dcxv.com',
	website: 'https://expenses.dcxv.com'
});

App.icons({
	'android_mdpi': 'icons/48.png',
	'android_hdpi': 'icons/72.png',
	'android_xhdpi': 'icons/96.png',
	'android_xxhdpi': 'icons/144.png',
	'android_xxxhdpi': 'icons/192.png',
});

App.launchScreens({
	'android_hdpi_portrait': 'icons/480x800.png',
	'android_xhdpi_portrait': 'icons/720x1280.png',
	'android_xxhdpi_portrait': 'icons/960x1600.png',
	'android_xxxhdpi_portrait': 'icons/1280x1920.png',
});

App.setPreference('BackgroundColor', '0x00000000');
App.setPreference('Orientation', 'default');
