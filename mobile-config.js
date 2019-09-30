App.info({
	id: 'com.denisix.meteor.expenny',
	name: 'Expenny',
	version: "0.0.1",
	description: 'Your Expenses / Revenues / Loans / Todos in one place',
	author: 'Denis',
	email: 'info@expenny.icu',
	website: 'https://expenny.icu'
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
