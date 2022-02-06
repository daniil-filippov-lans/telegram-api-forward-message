import bigInt = require('big-integer');
import SignalModel from 'models/signal.model';
import { Api, TelegramClient } from 'telegram';
import { MessageIDLike } from 'telegram/define';
import { StringSession } from 'telegram/sessions';
import {
    apiHash,
    apiId,
    desChannelId,
    srcChannelIds,
    stringSession,
} from './configuration';

const input = require('input');

const client = new TelegramClient(
    new StringSession(stringSession),
    apiId,
    apiHash,
    { connectionRetries: 5 }
);

export async function startServer() {
    await client.start({
        phoneNumber: async () => await input.text('phone number: '),
        password: async () => await input.text('2F password: '),
        phoneCode: async () => await input.text('Code: '),
        onError: (err) => console.log(err),
    });

    console.log('You should now be connected.');
    console.log('save session: ', client.session.save());

    client.addEventHandler(handleSrcMsg);
}

async function sendMessageToDestination(
    message: string,
    replyToMsgId: MessageIDLike
) {
    return client.invoke(
        new Api.messages.SendMessage({
            peer: new Api.PeerChannel({
                channelId: bigInt(desChannelId),
            }),
            message,
            replyToMsgId,
        })
    );
}

async function handleSrcMsg(event) {
    const message = event.message;

    // if the message from source channel
    const channelId = '-' + message?.peerId?.channelId?.value?.toString();

    if (srcChannelIds.includes(channelId)) {
        // check if this is new message (no replyTo)
        if (!message.replyTo) {
            // send message to des channel before saving to db
            const sendMsgResult = await sendMessageToDestination(
                message.message,
                null
            );

            console.log(sendMsgResult);
        } else {
            // find the root message
            const rootSignal = await SignalModel.findOne({
                srcChannelId: channelId,
                srcMsgId: message.replyTo.replyToMsgId,
            });
            // send message
            const sendMsgResult = await sendMessageToDestination(
                message.message,
                rootSignal.desMsgId
            );
            // save to db
            const newSignal = new SignalModel({
                srcChannelId: channelId,
                srcMsgId: message.id,
                desChannelId,
                desMsgId: sendMsgResult.updates[0].id,
                msg: message.message,
            });

            await newSignal.save();
        }
    }
}
