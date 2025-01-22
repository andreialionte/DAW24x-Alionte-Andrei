export default function DecodeGuid(){
    function extractTimestampFromGuidV7(guid) {
        // Step 1: Remove dashes
        const cleanedGuid = guid.replace(/-/g, "");
    
        // Step 2: Extract the first 12 hexadecimal characters (48 bits)
        const hexTimestamp = cleanedGuid.substring(0, 12);
    
        // Step 3: Convert hex to decimal (milliseconds)
        const timestampInMs = parseInt(hexTimestamp, 16);
    
        // Step 4: Return the timestamp in milliseconds
        return timestampInMs;
    }
}