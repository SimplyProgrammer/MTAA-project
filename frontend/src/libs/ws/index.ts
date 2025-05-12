export interface EventListeners {
	[event: string]: (data: any) => void;
}

export const createWebSocket = (name = "WebSocket", messageListeners: EventListeners, 
	onOpen = () => {
		console.log(`Web socket ${name} connected`);
	},
	onError = (error) => {
		console.error(`Web socket ${name} error:`, error);
	},
	onClose = () => {
		console.log(`Web socket ${name} closed`);
	}
) => {
	const ws = new WebSocket(`${process.env.EXPO_PUBLIC_API_URL.replace('http', 'ws').replace('https', 'ws')}`);

	ws.onopen = onOpen;

	ws.onmessage = (event) => {
		const message = JSON.parse(event.data);
		// console.log("Ws", message);

		if (!messageListeners[message.type])
			return console.warn(`No listener for message type ${message.type} registered for Web socket ${name}`);
		messageListeners[message.type](message.data);
	};

	ws.onerror = onError;

	ws.onclose = onClose;

	return ws;
};