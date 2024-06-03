import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from 'socket.io'

@WebSocketGateway()
export class MyGateway {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('onProduct')
    async onCreate(
        @MessageBody() body: any
    ) {
        try {
            return this.server.emit('CreateProgress', body);
        } catch (error) {
            this.server.emit('error', { message: 'An error occurred' });
        }
    }

    @SubscribeMessage('onProductUpload')
    async onUpload(
        @MessageBody() body: any
    ) {
        try {
            return this.server.emit('UploadProgress', body);
        } catch (error) {
            this.server.emit('error', { message: 'An error occurred' });
        }
    }
}
