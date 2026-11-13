
function testApp() {
    document.getElementById("status").innerText =
        "ComillaSoft Application Working!";

    document.getElementById("trx").innerText =
        "TEST123456";

    document.getElementById("amount").innerText =
        "100.00";
}

async function initializeBkashReader() {

    if (!window.Capacitor) {
        console.log("Browser testing mode");
        return;
    }

    console.log("Capacitor Android detected");
}

initializeBkashReader();


function parseBkashSms(sms) {

    // Accept only the expected payment notification format
    if (!sms.includes("You have received Tk")) {
        return null;
    }

    const amountMatch = sms.match(
        /You have received Tk\s*([\d,]+\.\d{2})\s+from/i
    );

    const senderMatch = sms.match(
        /from\s+(\d{11})/i
    );

    const refMatch = sms.match(
        /Ref\s+(.+?)\.\s*Fee/i
    );

    const feeMatch = sms.match(
        /Fee Tk\s*([\d,]+\.\d{2})/i
    );

    const trxMatch = sms.match(
        /TrxID\s+([A-Z0-9]+)/i
    );

    const dateMatch = sms.match(
        /at\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})/i
    );

    if (!amountMatch || !trxMatch) {
        return null;
    }

    return {
        amount: amountMatch[1].replace(/,/g, ""),
        sender: senderMatch ? senderMatch[1] : null,
        reference: refMatch ? refMatch[1] : null,
        fee: feeMatch ? feeMatch[1].replace(/,/g, "") : null,
        trx_id: trxMatch[1],
        transaction_date: dateMatch ? dateMatch[1] : null,
        transaction_time: dateMatch ? dateMatch[2] : null
    };
}


const testSms = `You have received Tk 500.00 from 01682062545. Ref Near Cafe. Fee Tk 0.00. Balance Tk 13,172.24. TrxID DKA5AA38AJ at 10/11/2026 06:06`;

const result = parseBkashSms(testSms);

console.log("Parsed bKash transaction:", result);

