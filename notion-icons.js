function getTab(n, child) {
	return document.querySelector(
		`div[style="display: flex; font-size: 14px; width: 100%; padding-left: 14px; padding-right: 14px; box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px; position: relative; z-index: 1;"] div:nth-child(${n}) ${
			child ? 'div' : ''
		}`
	);
}

function isCurrentTab(n) {
	return getTab(n).childNodes.length > 1;
}

function getCurrentTab() {
	let parent = document.querySelector(
		'div[style="display: flex; font-size: 14px; width: 100%; padding-left: 14px; padding-right: 14px; box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px; position: relative; z-index: 1;"]'
	);

	// We start from 1 here to negate the right-side actions div
	for (let i = 1; i < parent.childNodes.length; i++) {
		if (parent.childNodes[i].childNodes.length > 1) {
			return i;
		}
	}
}

function changeIcon(urlString) {
	document.querySelector('input[type=url]').focus();

	setTimeout(function() {
		let input = document.querySelector('input[type=url]');
		var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			window.HTMLInputElement.prototype,
			'value'
		).set;
		nativeInputValueSetter.call(input, urlString);

		var ev2 = new Event('input', { bubbles: true });
		input.dispatchEvent(ev2);
	}, 50);

	setTimeout(function() {
		const ke = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 });
		document.querySelector('input[type=url]').dispatchEvent(ke);
	}, 150);
}

function simulateReactClick(target) {
	const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
	mouseClickEvents.forEach(mouseEventType =>
		target.dispatchEvent(
			new MouseEvent(mouseEventType, {
				view: window,
				bubbles: true,
				cancelable: true,
				buttons: 1
			})
		)
	);
}

function resizeEmoji() {
	let emojiList = document.querySelectorAll(
		'div[style="cursor: pointer; user-select: none; transition: background 120ms ease-in 0s; display: flex; align-items: center; justify-content: center; border-radius: 3px; width: 32px; height: 32px; font-size: 24px;"]'
	);

	for (let i = 0; i < emojiList.length; i++) {
		emojiList[i].style.width = '33px';
		emojiList[i].style.height = '33px';
	}
}

function resizeModal() {
	let defaultModal = document.querySelector(
		'div[style="display: flex; flex-direction: column; width: 444px; min-width: 180px; max-width: calc(100vw - 24px); height: 356px; max-height: 70vh;"]'
	);

	if (defaultModal) {
		defaultModal.style.width = '458px';
		// 458 because emojis can scale up to 33px and it retains 14px padding standards
	}

	resizeEmoji();
}

function addIconsTab() {
	resizeModal();

	let iconsTab = getTab(3, false).cloneNode(true),
		parentIdentifier = `style="display: flex; font-size: 14px; width: 100%; padding-left: 14px; padding-right: 14px; box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px; position: relative; z-index: 1;"`,
		secondaryTabsIdentifier = `style="flex-grow: 1; display: flex; align-items: center; justify-content: flex-end; color: rgba(55, 53, 47, 0.6);"`;

	let parentNode = document.querySelector(`.notion-overlay-container div[${parentIdentifier}]`),
		secondaryTabsNode = document.querySelector(
			`.notion-overlay-container div[${parentIdentifier}] div[${secondaryTabsIdentifier}]`
		);

	iconsTab.childNodes[0].innerText = 'Icons';

	let insertedIconsTab = parentNode.insertBefore(iconsTab, secondaryTabsNode);

	// IE < 9 support
	if (insertedIconsTab.childNodes[0].attachEvent) {
		insertedIconsTab.childNodes[0].attachEvent('onclick', renderIconsTab);
		insertedIconsTab.childNodes[0].attachEvent('mouseenter', handleIconsTabMouseEnter);
		insertedIconsTab.childNodes[0].attachEvent('mouseleave', handleIconsTabMouseLeave);

		getTab(1, true).attachEvent('onclick', removeIcons);
		getTab(2, true).attachEvent('onclick', removeIcons);
		getTab(3, true).attachEvent('onclick', removeIcons);
	} else {
		insertedIconsTab.childNodes[0].addEventListener('click', renderIconsTab, false);
		insertedIconsTab.childNodes[0].addEventListener('mouseenter', handleIconsTabMouseEnter, false);
		insertedIconsTab.childNodes[0].addEventListener('mouseleave', handleIconsTabMouseLeave, false);

		getTab(1, true).addEventListener('click', removeIcons, false);
		getTab(2, true).addEventListener('click', removeIcons, false);
		getTab(3, true).addEventListener('click', removeIcons, false);
	}
	// return insertedIconsTab;
}

function renderIcon(iconPath) {
	let icon = `<div class="notion-icons-icon" style="cursor: pointer; user-select: none; transition: background 120ms ease-in 0s; display: flex; align-items: center; justify-content: center; border-radius: 3px; width: 43px; height: 43px; padding: 4px;"><img style="width: 100%; height: 100%;" src="${iconPath}"></div>`;
	return icon;
}

function renderIconsTabSet(title, author, authorLink, source) {
	let iconsTabBodyHeader = `<div style="display: flex; padding-left: 14px; padding-right: 14px; margin-top: 6px; margin-bottom: 8px; color: rgba(55, 53, 47, 0.6); font-size: 11px; line-height: 120%; user-select: none; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;"><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title +
		' by <a target="_blank" style="cursor: pointer; color: rgba(55, 53, 47);" href="' +
		authorLink +
		'">' +
		author +
		'</a>'}</div><div style="margin-left: auto;"><img class="loading-spinner" src="/images/loading-spinner.4dc19970.svg" style="visibility: hidden;"></div></div>`;

	let iconsTabBody =
		'<div style="display: flex; flex-wrap: wrap; align-items: flex-start; background: transparent; padding: 0px 12px 18px 12px; margin-bottom: 1px;">';
	for (let i = 0; i < 23; i++) {
		iconsTabBody += renderIcon(
			`https://raw.githubusercontent.com/jayhxmo/notion-icons/master/icons/${source}/${source}_${i}.png`
		);
	}
	iconsTabBody += '</div>';

	return iconsTabBodyHeader + iconsTabBody;
}

function renderIconsTab() {
	if (!isCurrentTab(4)) {
		// @ INTENT
		// Switch to 3rd tab if it's not on it so the link can be inputed in the underlay
		if (!isCurrentTab(3)) {
			simulateReactClick(getTab(3, true));
		}

		// @ INTENT
		// Change the active bar
		let iconsActiveBar = document.createElement('div');
		iconsActiveBar.id = 'notionIcons-activeBar';
		iconsActiveBar.style.cssText =
			'border-bottom: 3px solid rgb(55, 53, 47); position: absolute; bottom: -1px; left: 0px; right: 0px;';

		let tabLinkWidth = getTab(3, false).getBoundingClientRect().width;

		let linkActiveBarCover1 = document.createElement('div');
		linkActiveBarCover1.className = 'notionIcons-activeBarCover';
		linkActiveBarCover1.style.cssText = `border-bottom: 2px solid rgba(255, 255, 255); position: absolute; bottom: 0px; left: 0px; transform: translateX(-100%); right: 0px; width: ${tabLinkWidth}px`;

		let linkActiveBarCover2 = document.createElement('div');
		linkActiveBarCover2.className = 'notionIcons-activeBarCover';
		linkActiveBarCover2.style.cssText = `border-bottom: 1px solid #ededec; position: absolute; bottom: -1px; left: 0px; transform: translateX(-100%); right: 0px; width: ${tabLinkWidth}px`;
		// The above uses HEX value over RGBA because it needs to cover up the dark active bar on LInk Tab

		let tabIcons = getTab(4, false);
		tabIcons.style.position = 'relative';

		tabIcons.appendChild(iconsActiveBar);
		tabIcons.appendChild(linkActiveBarCover1);
		tabIcons.appendChild(linkActiveBarCover2);

		console.log('Current Tab', getCurrentTab());
		console.log('Current Tab data', getTab(getCurrentTab(), false));
		console.log('Current Tab data 2', getTab(getCurrentTab(), false).childNodes);
		console.log('Current Tab children', getTab(getCurrentTab(), false).childNodes.length);
		// getTab(getCurrentTab(), false).childNodes[1].style.display = 'none';

		// @ INTENT
		// Convert data into renderable
		let tabBody = document.querySelector('.notion-overlay-container .notion-scroller.vertical');

		let render = '';
		render += renderIconsTabSet('For Creators', 'Minhee Yoon', 'https://dribbble.com/miniY', 'FC');
		render += renderIconsTabSet('For Designers', 'Minhee Yoon', 'https://dribbble.com/miniY', 'FD');

		// @ ALERT
		// The below breaks the app since React does not want its structure tampered with

		// tabBody.innerHTML = `<div style="display: flex; flex-direction: column; padding-bottom: 8px;"><div style="flex-grow: 1;">${render}</div></div>`;

		// for (let i = 0; i < tabBody.childNodes.length; i++) {
		// 	tabBody.childNodes[i].style.display = 'none';
		// }

		let tabModalBoundingBox = document
			.querySelector(
				'.notion-overlay-container div[style="display: flex; align-items: center; position: relative; flex-direction: column-reverse; transform-origin: 50% top; left: 0px; top: 4px; opacity: 1;"]'
			)
			.getBoundingClientRect();
		let tabHeaderBoundingBox = document
			.querySelector(
				'.notion-overlay-container div[style="display: flex; font-size: 14px; width: 100%; padding-left: 14px; padding-right: 14px; box-shadow: rgba(55, 53, 47, 0.09) 0px 1px 0px; position: relative; z-index: 1;"]'
			)
			.getBoundingClientRect();

		let notionIcons = document.createElement('div');
		notionIcons.id = 'notionIcons';
		notionIcons.innerHTML += `<div id="notion-icons" style="position: absolute; z-index: 9999999; top: ${tabModalBoundingBox.y +
			tabHeaderBoundingBox.height +
			1 +
			'px'}; left: ${tabModalBoundingBox.x + 'px'}; width: ${tabModalBoundingBox.width +
			'px'}; height: ${tabModalBoundingBox.height -
			tabHeaderBoundingBox.height -
			1 +
			'px'}; overflow-x: hidden; overflow-y: scroll; background: rgba(255, 255, 255); border-radius: 3px; display: flex; flex-direction: column; padding-bottom: 8px; padding-top: 18px;"><div style="flex-grow: 1;">${render}</div></div>`;
		// The +1 is to compensate for border

		document.body.appendChild(notionIcons);

		let notionIconsIcon = document.querySelectorAll('.notion-icons-icon');
		if (notionIconsIcon[0].attachEvent) {
			for (let i = 0; i < notionIconsIcon.length; i++) {
				notionIconsIcon[i].attachEvent('onclick', handleIconClick);
				notionIconsIcon[i].attachEvent('mouseenter', handleIconMouseEnter);
				notionIconsIcon[i].attachEvent('mouseleave', handleIconMouseLeave);
			}
		} else {
			for (let i = 0; i < notionIconsIcon.length; i++) {
				notionIconsIcon[i].addEventListener('click', handleIconClick, false);
				notionIconsIcon[i].addEventListener('mouseenter', handleIconMouseEnter, false);
				notionIconsIcon[i].addEventListener('mouseleave', handleIconMouseLeave, false);
			}
		}
	}
}

function handleIconsTabMouseEnter() {
	let iconsTab = getTab(4, false);
	iconsTab.childNodes[0].style.background = 'rgba(55, 53, 47, 0.08)';
}

function handleIconsTabMouseLeave() {
	let iconsTab = getTab(4, false);
	iconsTab.childNodes[0].style.background = '';
}

function handleIconClick(e) {
	if (e.target.childNodes.length) {
		console.log(e.target.childNodes[0].src);
	} else {
		console.log(e.target.src);
	}
}

function handleIconMouseEnter(e) {
	e.target.style.background = 'rgba(55, 53, 47, 0.08)';
}

function handleIconMouseLeave(e) {
	e.target.style.background = '';
}

function removeIcons() {
	let notionIcons = document.querySelector('#notionIcons'),
		notionsIconsBar = document.querySelector('#notionIcons-activeBar'),
		notionsIconsBarCovers = document.querySelectorAll('.notionIcons-activeBarCover');

	if (notionIcons) {
		notionIcons.remove();
	}

	if (notionsIconsBar) {
		notionsIconsBar.remove();
		getTab(4, false).style.position = '';
	}

	if (notionsIconsBarCovers.length) {
		for (let i = 0; i < notionsIconsBarCovers.length; i++) {
			notionsIconsBarCovers[i].remove();
		}
	}
}

function addNotionIcons() {
	addIconsTab();
	renderIconsTab();
}
