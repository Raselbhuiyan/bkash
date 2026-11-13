
package com.comillasoft.com;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

public class BkashSmsReceiver extends BroadcastReceiver {

    private static final String TAG = "BkashSmsReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {

        if (!Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            return;
        }

        SmsMessage[] messages =
            Telephony.Sms.Intents.getMessagesFromIntent(intent);

        if (messages == null || messages.length == 0) {
            return;
        }

        StringBuilder body = new StringBuilder();
        String sender = null;

        for (SmsMessage message : messages) {
            if (sender == null) {
                sender = message.getOriginatingAddress();
            }
            body.append(message.getMessageBody());
        }

        if (sender == null || !sender.equalsIgnoreCase("bKash")) {
            Log.d(TAG, "Ignored SMS sender: " + sender);
            return;
        }

        String smsText = body.toString();

        if (!smsText.contains("You have received Tk")) {
            Log.d(TAG, "Not a matching payment notification");
            return;
        }

        Log.d(TAG, "Matching bKash SMS received");

        // Next step: parse and securely queue the transaction.
    }
}
