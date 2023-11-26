const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
		io.emit("callEnded");
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
    	socket.on("requestStream", ({ to }) => {
        io.to(to).emit("requestStream");
    	});
	    // Evento emitido cuando un usuario actualiza su stream
    	socket.on("streamUpdated", ({ id }) => {
        // Notifica al otro peer que debe prepararse para la renegociación
        socket.broadcast.to(id).emit("prepareRenegotiation");
    	});

    	// Evento para manejar la renegociación
    	socket.on("renegotiate", ({ to, signal }) => {
        // Envía la señalización para la renegociación
        io.to(to).emit("renegotiate", { signal });
    	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
