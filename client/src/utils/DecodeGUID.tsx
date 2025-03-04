export default function DecodeGuid(){
    function extractTimestampFromGuidV7(guid) {
        const cleanedGuid = guid.replace(/-/g, "");
        const hexTimestamp = cleanedGuid.substring(0, 12);
        const timestampInMs = parseInt(hexTimestamp, 16);
        return timestampInMs;
    }
}