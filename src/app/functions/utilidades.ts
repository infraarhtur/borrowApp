import * as _ from 'lodash';

export function cargarArchivoTextoAjaxSync(
  rutaArchivo: string,
  mimeType: string
) {
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', rutaArchivo, false);

  if (!_.isNil(mimeType)) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();

  if (xmlhttp.status === 200) {
    return xmlhttp.responseText;
  } else {
    return null;
  }
}

export function cargarJSON(rutaArchivo: string) {
  const json:string = cargarArchivoTextoAjaxSync(rutaArchivo, 'application/json')!;
  return JSON.parse(json);
}
