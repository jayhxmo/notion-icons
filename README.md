# Notion Icons
(Unofficial) Use custom icon sets in Notion directly

![Notion Icons in action](https://media.giphy.com/media/JUGN9kqMVjiSgKDIWS/giphy.gif)


## Usage
You can either [download the Chrome extension here](https://chrome.google.com/webstore/detail/notion-icons/ggbhaojjpaliiapffmdjiiafemmephhk) (recommended), or [use it in the app](#use-in-the-app-not-recommended) (not recommended).

[![Download Chrome Extension](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/notion-icons/ggbhaojjpaliiapffmdjiiafemmephhk)


## Contributing
### Adding More Icon Sets
Information for icon sets are stored in `icons.json`, and the icon image files are stored in `icons/` folder. The `notion-icons.js` script (which is the uncompressed version of the injected script) receives icon data directly from this repository.

Use `rename-icons.js` to rename icons into a readable format (there is no back-end, so icons need to be named in the format of `FOLDERNAME_#.png` with `#` representing the #th icon (e.g. in `icons/FD`, there are `FD_0.png`, `FD_1.png`...`FD_23.png`).

To rename icons, run the below with `FOLDERNAME` being the folder name of the new icon set in `icons/` directory.
```bash
node rename-icons FOLDERNAME
```


## Use In The App (Not Recommended)
This is not recommended, but here is how to do it for macOS if you desire. The process should be similar in Windows.
Install Asar
```bash
npm install -g asar
```
Navigate to the `Notion.app/Resources` folder
```bash
cd /Applications/Notion.app/Contents/Resources
```
Extract the `app.asar` file
```bash
asar extract app.asar app
```
Rename the current `app.asar` file so it's no longer used
```bash
mv app.asar app.asar.old
```
Open the `index.js` file in the `renderer` folder
```bash
open renderer/index.js
```
Navigate to around Line 124. Inside the `notionElm.addEventListener("dom-ready", function () {` function, right under the `notionIpc.proxyAllMainToNotion(notionElm);`, paste the below code.
>*🔴 Warning: The code below injects a JavaScript file remotely from an online CDN, which can be a security risk with untrusted sources. It is recommended you host your own file or manually paste the code from `notion-icons-compressed.js` in. The below code uses the jsDelivr CDN which takes the code directly from GitHub so it will receive updates.*
```javascript
document.getElementById('notion').getWebContents().executeJavaScript(`function getAsynchronously(n,t){var o=new XMLHttpRequest;o.onreadystatechange=function(){4==o.readyState&&200==o.status&&t(o.responseText)},o.open("GET",n,!0),o.send(null)}getAsynchronously("https://cdn.jsdelivr.net/gh/jayhxmo/notion-icons/notion-icons.compressed.js",function(n){let t=document.createElement("script");t.id="notionIconsScript";let o=n+"notionIconsWeb = false; currentPath = location.pathname; initializeNotionIcons();";t.innerHTML=o,document.body.appendChild(t)});`);
```
Save `index.js`, and you're set!

---

For those who want to use their own source or manually paste the code in, this is the uncompressed version of the above code:
```javascript
function getAsynchronously(urlString, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", urlString, true);
    xmlHttp.send(null);
} 
getAsynchronously('https://notion-icons-ewcyzotqur.now.sh/notion-icons.compressed.js', function(notionIconsScriptData) {
    let notionIconsScript = document.createElement('script');
    notionIconsScript.id = 'notionIconsScript';
    let iconsCompiledScript = notionIconsScriptData + 'notionIconsWeb = false; currentPath = location.pathname; initializeNotionIcons();';
    notionIconsScript.innerHTML = iconsCompiledScript;
    document.body.appendChild(notionIconsScript);  
});
```

---
License: [MIT](https://github.com/jayhxmo/notion-icons/blob/master/LICENSE)

Contact: jay at jaymo.io
