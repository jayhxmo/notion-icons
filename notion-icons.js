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
	} else {
		insertedIconsTab.childNodes[0].addEventListener('click', renderIconsTab, false);
		insertedIconsTab.childNodes[0].addEventListener('mouseenter', handleIconsTabMouseEnter, false);
		insertedIconsTab.childNodes[0].addEventListener('mouseleave', handleIconsTabMouseLeave, false);
	}
	// return insertedIconsTab;
}

function renderIconsTabSet(title, author, authorLink, source) {
	let iconsTabBodyHeader = `<div style="display: flex; padding-left: 14px; padding-right: 14px; margin-top: 6px; margin-bottom: 8px; color: rgba(55, 53, 47, 0.6); font-size: 11px; line-height: 120%; user-select: none; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;"><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title +
		' by <a target="_blank" style="cursor: pointer; color: rgba(55, 53, 47);" href="' +
		authorLink +
		'">' +
		author +
		'</a>'}</div><div style="margin-left: auto;"><img class="loading-spinner" src="/images/loading-spinner.4dc19970.svg" style="visibility: hidden;"></div></div>`;
	return iconsTabBodyHeader;
}

function renderIconsTab() {
	// Switch to 2nd tab so when Image is selected, it's possible to switch over to Link (3rd tab)
	if (isCurrentTab(3)) {
		// Need to hide instead of overwriting
	} else {
		let tabBody = document.querySelector('.notion-overlay-container .notion-scroller.vertical');

		let render = '';
		render += renderIconsTabSet('For Creators', 'Minhee Yoon', 'https://dribbble.com/miniY', 'FC');
		tabBody.innerHTML = render;
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

function watchRemoveIconsTab() {
	// element.attachEvent('onclick', myFunctionReference);
	// element.addEventListener('click', myFunctionReference , false);
}

function removeIconsTab() {}

function addNotionIcons() {
	addIconsTab();
	renderIconsTab();
}
