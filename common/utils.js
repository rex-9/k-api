export async function convertToMSISDN(phoneNo, countryCode) {
  // check if phoneNo already has the countryCode
  const regex = new RegExp(`^\\+${countryCode}`);
  if (regex.test(phoneNo)) {
    return phoneNo; // phoneNo already has countryCode
  } else {
    // remove leading zeros from phoneNo
    phoneNo = phoneNo.replace(/^0+/, '');
    return `+${countryCode}${phoneNo}`; // add countryCode to phoneNo
  }
}
