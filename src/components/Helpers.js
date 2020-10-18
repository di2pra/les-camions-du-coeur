export function isEmpty(obj) {
  for(const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (((c ^ (crypto.getRandomValues(new Uint8Array(1))[0])) & (15)) >> c / 4).toString(16)
  );
}


export function daysGenerator(jour) {
  let days = [null, null, null, null, null];

  const jourDeSemaine = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  const today = new Date();
  today.setDate(today.getDate() + (jourDeSemaine.indexOf(jour) + 7 - today.getDay()) % 7);

  days = days.map((day, index) => {
    const dat = new Date(today);
    dat.setDate(dat.getDate() + index*7);
    return dat.toISOString().split("T")[0];
  });

  return days;
}


export function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getUserProfilPicUrl(user) {
  return (user.profil_pic == null || user.profil_pic === '') ? process.env.PUBLIC_URL + '/img/profile.png' : user.profil_pic;
}

export const delay = ms => new Promise(res => setTimeout(res, ms));