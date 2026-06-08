
/*miFuncion()*/
function miFuncion()
{
//hago algo...
document.write("Esto va bien")
}



function marco()
{
var hashString=location.hash;
if(hashString.length==0)
{
	document.write("secure.asp");
	return ("secure.asp");
}
else
{
	document.write("secure.asp" + hashString);
	marco=hashString;
	return marco;
}
}



function ventana(nombre)
{
		window.open(nombre,'DatosFamiliares',
		'width=400,height=370,menubar=no,toolbar=no,location=no,scrollbars=no, resizable=no,top=210, left=332')
}


	
function Valida_Dato(e,opc)
{
		//Segun la opcion se habilita o no el espacio
		tecla = (document.all) ? e.keyCode : e.which;
		if (tecla==8 || tecla==0 || tecla==13 || tecla==42) return true; //Tecla de retroceso (para poder borrar)
		switch(opc)
		{
		case 1://Para numeros enteros en general. Solicitudes, cedulas,nit, numeros de identificacion, etc
		patron = /[1234567890 a-z A-Z .]/; //solo numeros y lineas
		break;
		
		case 2://Para texto largo general
		if (tecla==32) return true; //Tecla de espacio
		patron = /[a-zA-ZÃï½Ã?Â±Ññ1234567890,.()Ã?ï¿½Ã?ï¿½Ã?ï¿½Ã?ï¿½Ã?ï¿½Ã?Â¡Ã?Â©Ã?Â­Ã?Â³Ã?Âº]/; //caracteres y numeros
		break;
		 
		case 3://Para numeros telefonicos
		
		if (tecla==32) return true; //Tecla de espacio
		
		patron = /[EXText1234567890.()-]/;
		break;
		 
		case 4://para campos que necesitan valores numericos de precios
		patron = /[1234567890.,]/; //solo numeros puntos y comas
		break;
		 
		case 5://Para validar campos de fecha
		patron = /[1234567890\/]/; //solo numeros
		break;
		 
		case 6://Para validar campos de nombre
		if (tecla==32) return true; //Tecla de espacio
		patron = /[a-zA-ZÃïÃ?Â±ÃÂ¡ÃÂ©ÃÂ­ÃÂ³Ã?ÂºÑñ.\/-]/;
		break;
		 
		case 7://Para validar cedula
		if(tecla==8 ) return true; //tecla de retroceso
		patron = /[1234567890 a-z A-Z]/; //solo numeros y lineas
		break;
		
		case 8://Para nÃ?Âºmeros enteros positivos
		patron = /[1234567890]/; //solo numeros enteros positivos
		break;
		
		case 9://Direcciones
		if (tecla==32 || tecla==0) return true; //Tecla de espacio
		patron = /[a-zA-ZÃï½ÃÂÑñ±1234567890.\/#(),-]/;
		break;
		
		case 10://Caracteres y nÃ?Âºmeros
		if (tecla==32) return true;
		patron = /[a-zA-ZÃï½Ã?ÂÑñ±1234567890]/;
		break;
		
		case 11://para campos tipo de sangre
		patron = /[a-bOoA-B+-]/; //solo numeros puntos y comas
		break;
		 
		
		}
		
		te = String.fromCharCode(tecla);
		
		return patron.test(te);

}

//funcino asegura solo ingreso de enteros
function IngresaNumero(e) { 
	var nav4 = window.Event ? true : false;
	var key = nav4 ? e.which : e.keyCode;
	return (key <= 13 || (key >= 48 && key <= 57) || key == 44);
	}
	
	
	
function formato(element,opt) 
{   
		var er_pasaporte = /(^([A-Z][0-9]{5,5}))$/                //5 numeros y una letra   
    	var er_dni = /(^([0-9]{13,13}\[A-Z]))$/        //14 números y una letra         
		var er_dni = /(^([0-9]{13,13}[A-Z]))$/        //8 números, un guion y una letra, o cadena vacia     
		var tsangre=/(^([A-B]{2,2}\[+]))$/ 

	if (opt==1)
	{
			if(!er_dni.test(element.value)) 
				{ 
					alert('Contenido del campo Cédula no válido: ' + element.value) 
					document.getElementById(element.id).value = "";
					setTimeout(function(){document.getElementById(element.id).focus()},10);
					return false;
				 }  
			return true;
		
	}
	if (opt==2)
	{
			if(!tsangre.test(element.value)) 
				{ 
					alert('Contenido del campo no válido: ' + element.value) 
					document.getElementById(element.id).value = "";
					setTimeout(function(){document.getElementById(element.id).focus()},10);
					return false;
				 }  
			return true;
		
	}
	
} 

function FechaValida(fecha){
    if (fecha != undefined && fecha.value != "" ){
        if (!/^\d{2}\/\d{4}$/.test(fecha.value)){
            alert("Formato de fecha no válido (dd/mm/aaaa)");
			document.getElementById(fecha.id).value = "";
			setTimeout(function(){document.getElementById(fecha.id).focus()},10);
            return false;
        }
        //var dia  =  parseInt(fecha.value.substring(0,2),10);
        var mes  =  parseInt(fecha.value.substring(0,2),10);
        var anio =  parseInt(fecha.value.substring(3,6),10);
 
    switch(mes){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8: 
        case 10:
        case 12:
            numDias=31;
            break;
        case 4: case 6: case 9: case 11:
            numDias=30;
            break;
        case 2:
            if (comprobarSiBisisesto(anio)){ numDias=29 }else{ numDias=28};
            break;
        default:
            alert("Formato de fecha no válido (dd/mm/aaaa)");
			document.getElementById(fecha.id).value = "";
			setTimeout(function(){document.getElementById(fecha.id).focus()},10);
            return false;
    }
 
         return true;
    }
}



function esFechaValida(fecha){
    if (fecha != undefined && fecha.value != "" ){
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(fecha.value)){
            alert("Formato de fecha no válido (dd/mm/aaaa)");
			document.getElementById(fecha.id).value = "";
			setTimeout(function(){document.getElementById(fecha.id).focus()},10);
            return false;
        }
        var dia  =  parseInt(fecha.value.substring(0,2),10);
        var mes  =  parseInt(fecha.value.substring(3,5),10);
        var anio =  parseInt(fecha.value.substring(6),10);
 
    switch(mes){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8: 
        case 10:
        case 12:
            numDias=31;
            break;
        case 4: case 6: case 9: case 11:
            numDias=30;
            break;
        case 2:
            if (comprobarSiBisisesto(anio)){ numDias=29 }else{ numDias=28};
            break;
        default:
            alert("Formato de fecha no válido (dd/mm/aaaa)");
			document.getElementById(fecha.id).value = "";
			setTimeout(function(){document.getElementById(fecha.id).focus()},10);
            return false;
    }
 
        if (dia>numDias || dia==0){
            alert("Formato de fecha no válido (dd/mm/aaaa)");
			document.getElementById(fecha.id).value = "";
			setTimeout(function(){document.getElementById(fecha.id).focus()},10);
            return false;
        }
        return true;
    }
}
 
function comprobarSiBisisesto(anio){
if ( ( anio % 100 != 0) && ((anio % 4 == 0) || (anio % 400 == 0))) {
    return true;
    }
else {
    return false;
    }
}



//busca caracteres que no sean espacio en blanco en una cadena  
 function vacio(q) {  
         for ( i = 0; i < q.length; i++ ) {  
                 if ( q.charAt(i) != " " ) {  
                         return true  
                 }  
         }  
        return false  
 }  
   
 //valida que el campo no este vacio y no tenga solo espacios en blanco  
 function validavacio(F) {  
      var texto = F.value;
		//limpiamos de espacios en blanco el texto
	  var texto_limpio = texto.replace(/^\s+|\s+$/g, "");

     if (texto_limpio.length==0 )
		 {  
                 alert("Favor completar información para este campo.")  
				 setTimeout(function(){document.getElementById(F.id).focus()},10);
                 return false  
         }
		 else
		 {  
                 //alert(F.value)  
				 return true
         }  
           
 } 
 
 function validacombo(F) {  
      var area = F.value;
		//limpiamos de espacios en blanco el texto
	
     if (area=="N")
		 {  
                 alert("Favor verificar selección.")  
				 setTimeout(function(){document.getElementById(F.id).focus()},10);
                 return false  
         }
		 else
		 {  
                 //alert(F.value)  
				 return true
         }  
           
 } 
 
 
 

function mensaje()
{
 alert ("Familiar se encuentra registrado, favor verifique")
 //window.close();
 location.href="secure.asp#marco2"

}



function validar_dg(theForm)
{
	if (document.frmsolicitud.pnombre.value == "" ||
		document.frmsolicitud.snombre.value == "" ||
		document.frmsolicitud.papellido.value == "" ||
		document.frmsolicitud.sapellido.value == "" ||
		document.frmsolicitud.lugar_nac.value == "" ||
		document.frmsolicitud.fecha_nac.value == "" ||
		document.frmsolicitud.nacionalidad.value == "" ||
		document.frmsolicitud.inss.value == "" ||
		document.frmsolicitud.ruc.value == "" ||
		document.frmsolicitud.pasaporte.value == "" ||
		document.frmsolicitud.estado_civil.value == "" ||
		document.frmsolicitud.tsangre.value == "" ||
		document.frmsolicitud.estatura.value == "" ||
		document.frmsolicitud.peso.value == "" ||
		document.frmsolicitud.tlicencia.value == "" ||
		document.frmsolicitud.vehiculo.value == "" ||
		document.frmsolicitud.marca.value == "" ||
		document.frmsolicitud.ano_vehic.value == "" ||
		document.frmsolicitud.celular.value == "" ||
		document.frmsolicitud.telefono.value == "" ||
		document.frmsolicitud.departamento_dom.value == "" ||
		document.frmsolicitud.ciudad_dom.value == "" ||
		document.frmsolicitud.direccion.value == "" || 
		document.frmsolicitud.cuenta_banco.value == "" || 
		document.frmsolicitud.banco.value == "" || 
		document.frmsolicitud.no_cuenta.value == "" || 
		document.frmsolicitud.ingreso.value == "" || 
		document.frmsolicitud.penfermedad.value == "" || 
		document.frmsolicitud.enfermedad.value == "" || 
		document.frmsolicitud.palergia.value == "" || 
		document.frmsolicitud.alergia.value == "" || 
		document.frmsolicitud.tipo_casa.value == "" || 
		document.frmsolicitud.contacto_emer.value == "" || 
		document.frmsolicitud.parentesco_cont.value == "" || 
		document.frmsolicitud.numruc.value == "" || 
		document.frmsolicitud.tel_contacto.value == "" 	
		) 
  			 {
				alert("Complete todos los datos para continuar");
    			return(false)
   			 }
return(true)
}


function validar_dgg(theForm)
{
	if (document.frmsolicitud.radiod.value == "" ||
		document.frmsolicitud.radiot.value == "" )
	     {
				alert("Seleccione opción para continuar");
    			return(false)
   			 }
return(true)
}



function validar_puesto(theForm)
{
	
	if ( document.frmsolicitud.salario_max.value < 1 || document.frmsolicitud.salario_min.value < 1	) 
  			 {
				alert("Verifique aspiracion salarial");
    			return(false)
   			 }

return(true)
}


function textCounter(field, countfield, maxlimit) {
if (field.value.length > maxlimit) // if too long...trim it!
field.value = field.value.substring(0, maxlimit);
// otherwise, update 'characters left' counter
else 
countfield.value = maxlimit - field.value.length;
}
 
 



 
 

