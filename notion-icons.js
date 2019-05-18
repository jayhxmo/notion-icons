let notionIconsGarbageCollector = [];

function throttle(func, limit) {
	let inThrottle;
	return function() {
		const args = arguments;
		const context = this;
		if (!inThrottle) {
			func.apply(context, args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

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

	// setTimeout(function() {
	let input = document.querySelector('input[type=url]');
	var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
		.set;
	nativeInputValueSetter.call(input, urlString);

	var ev2 = new Event('input', { bubbles: true });
	input.dispatchEvent(ev2);
	// }, 15);

	// setTimeout(function() {
	const ke = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: 13 });
	document.querySelector('input[type=url]').dispatchEvent(ke);
	removeIcons();
	// Need to wait for React to re-render. Should use MutationObserver if possible
	// But to epxloit this as bad experience will take user to close and click again within 100ms
	// Which probably is not possible for even StarCraft players
	setTimeout(initializeIconTriggerListener, 100);
	// }, 50);
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

	// @ INTENT
	// Add close event listener to the fog layer
	let modalCloseTrigger = document.querySelector(
		'.notion-overlay-container div[style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh;"]'
	);

	// @ INTENT
	// Only disconnect if the modal is actually open.
	// MutationObserver sometimes fires for undesired cases.
	if (modalCloseTrigger) {
		overlayContainerObserver.disconnect();
	}

	// This might have duplicate / stacking eventListeners (not sure) but it shouldn't be costly snice removeIcons is simple
	if (modalCloseTrigger.attachEvent) {
		modalCloseTrigger.attachEvent('onclick', removeIcons);
		modalCloseTrigger.attachEvent('oncontextmenu', removeIcons);
	} else {
		modalCloseTrigger.addEventListener('click', removeIcons, false);
		modalCloseTrigger.addEventListener('contextmenu', removeIcons, false);
	}

	//////

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

	notionIconsGarbageCollector.push(getTab(1, true));
	notionIconsGarbageCollector.push(getTab(2, true));
	notionIconsGarbageCollector.push(getTab(3, true));
	// return insertedIconsTab;

	// @ INTENT
	// Handles closing the Icons overlay for lesser-thought cases like Escape, Remove button, etc..
	let secondaryActions = document.querySelectorAll(
		`div[${parentIdentifier}] div[style="cursor: pointer; user-select: none; transition: background 120ms ease-in 0s; display: inline-flex; align-items: center; flex-shrink: 0; white-space: nowrap; height: 28px; border-radius: 3px; font-size: 14px; line-height: 1.2; min-width: 0px; padding-left: 8px; padding-right: 8px; color: rgba(55, 53, 47, 0.6);"]`
	);
	if (secondaryActions.length) {
		let tabRemove = secondaryActions[secondaryActions.length - 1];

		if (tabRemove.attachEvent) {
			tabRemove.attachEvent('onclick', removeIcons);
		} else {
			tabRemove.addEventListener('click', removeIcons, false);
		}

		notionIconsGarbageCollector.push(tabRemove);
	}

	// For some reason document.addEventListener does not do the job
	window.addEventListener('keydown', removeIconsOnEscape);
}

function renderIcon(iconPath) {
	let icon = `<div class="notion-icons-icon" style="cursor: pointer; user-select: none; transition: background 120ms ease-in 0s; display: flex; align-items: center; justify-content: center; border-radius: 3px; width: 43px; height: 43px; padding: 4px;"><img style="width: 100%; height: 100%;" src="${iconPath}"></div>`;
	return icon;
}

function renderIconsTabSet(title, author, authorLink, source, count) {
	let iconsTabBodyHeader = `<div style="display: flex; padding-left: 14px; padding-right: 14px; margin-top: 6px; margin-bottom: 8px; color: rgba(55, 53, 47, 0.6); font-size: 11px; line-height: 120%; user-select: none; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;"><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title +
		' by <a target="_blank" style="cursor: pointer; color: rgba(55, 53, 47);" href="' +
		authorLink +
		'">' +
		author +
		'</a>'}</div><div style="margin-left: auto;"><img class="loading-spinner" src="/images/loading-spinner.4dc19970.svg" style="visibility: hidden;"></div></div>`;

	let iconsTabBody =
		'<div style="display: flex; flex-wrap: wrap; align-items: flex-start; background: transparent; padding: 0px 12px 18px 12px; margin-bottom: 1px;">';
	for (let i = 0; i < count; i++) {
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

		// @ INTENT
		// Convert data into renderable
		let tabBody = document.querySelector('.notion-overlay-container .notion-scroller.vertical');

		let render = '';
		render += renderIconsTabSet('For Creators', 'Minhee Yoon', 'https://dribbble.com/miniY', 'FC', 23);
		render += renderIconsTabSet('For Designers', 'Minhee Yoon', 'https://dribbble.com/miniY', 'FD', 41);

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
				notionIconsGarbageCollector.push(notionIconsIcon[i]);
			}
		} else {
			for (let i = 0; i < notionIconsIcon.length; i++) {
				notionIconsIcon[i].addEventListener('click', handleIconClick, false);
				notionIconsIcon[i].addEventListener('mouseenter', handleIconMouseEnter, false);
				notionIconsIcon[i].addEventListener('mouseleave', handleIconMouseLeave, false);
				notionIconsGarbageCollector.push(notionIconsIcon[i]);
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
		changeIcon(e.target.childNodes[0].src);
	} else {
		changeIcon(e.target.src);
	}
}

function handleIconMouseEnter(e) {
	e.target.style.background = 'rgba(55, 53, 47, 0.08)';
}

function handleIconMouseLeave(e) {
	e.target.style.background = '';
}

function removeIconsOnEscape(e) {
	if (e.keyCode == 27) {
		removeIcons();
	}
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

	if (notionIconsGarbageCollector.length) {
		for (let i = 0; i < notionIconsGarbageCollector.length; i++) {
			notionIconsGarbageCollector[i] = null;
		}
		notionIconsGarbageCollector = [];
	}

	window.removeEventListener('keydown', removeIconsOnEscape);
}

// @ INTENT
// Since React does not render immediately on click, watch DOM change to trigger instead of a random 50 second delay
// This does not need to be throttled since it disconnects soon after (only active during the delay that React takes to render)
let overlayContainer = document.querySelectorAll('.notion-overlay-container')[0];
const overlayContainerObserver = new MutationObserver(function(mutations) {
		if (mutations) addIconsTab();
	}),
	overlayContainerConfig = { attributes: true, childList: true, characterData: true };

function initializeIcons() {
	overlayContainerObserver.observe(overlayContainer, overlayContainerConfig);
}

// @ INTENT
// Add eventListener to trigger and initalize Icons tab
let notionModalTrigger;
function initializeIconTriggerListener() {
	let triggerParentIdentifier =
		'.notion-cursor-listener .notion-frame .notion-scroller div[style="padding-left: 96px; padding-right: 96px; max-width: 100%; margin-bottom: 0.5em; width: 900px;"] div';
	let notionModalTriggerEmoji = document.querySelector(`${triggerParentIdentifier} div`);
	let notionModalTriggerImg = document.querySelector(`${triggerParentIdentifier} img`);

	notionModalTrigger = notionModalTriggerEmoji ? notionModalTriggerEmoji : notionModalTriggerImg;
	// IE < 9 support
	if (notionModalTrigger.attachEvent) {
		notionModalTrigger.attachEvent('onclick', initializeIcons);
	} else {
		notionModalTrigger.addEventListener('click', initializeIcons, false);
	}
	// Skip garbageCollecting
	// Probably not necessary since it gets overwritten as it changes between emojis <-> images anyways, but not entirely sure
}

// @ INTENT
// Can't catch React Router changed, so need to watch DOM
// This observer does not ever disconnect unless there is a better way to see
// @ ALERT
// This needs to be throttled 100%. Too costly otherwise and don't need it to be very active
const notionFrameObserver = new MutationObserver(
	throttle(function(mutations) {
		if (mutations && location.pathname != currentPath) {
			// console.log('NEW PATH');
			// console.log(mutations);

			// Wait for load
			setTimeout(initializeIconTriggerListener, 500);
			currentPath = location.pathname;
		} else if (mutations && location.pathname == currentPath) {
			// document.body.contains is probably costly
			if (!notionModalTrigger || !document.body.contains(notionModalTrigger)) {
				initializeIconTriggerListener();
			}
		}
	}, 200),
	(notionFrameConfig = { attributes: true, childList: true, characterData: true, subtree: true })
);
// Using subtree is probably not very performant (since it detects all hovers and such)
// but probably better than having two MutationObservers working in the same tree branch

let currentPath = '';
document.body.onload = function() {
	currentPath = location.pathname;
	setTimeout(function() {
		initializeIconTriggerListener();
		notionFrameObserver.observe(document.querySelector('.notion-frame'), notionFrameConfig);
	}, 250);
};
