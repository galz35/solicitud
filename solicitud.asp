<%
'Comprobar que está autorizado
IF IsEmpty(session("cedula")) then
'No está autorizado
response.redirect "index.asp"
end if
'Lo demas solo lo recibe el cliente autorizado, y recibe solo las copias de las variables de session que le pertenecen...
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>
<title>Solicitud de Empleo</title>
<style type="text/css">
<!--
body {
	background-color: #D62818;
	}
body,td,th {
	color: #000;
}
-->
</style>

<script type="text/javascript">
var tinac;
function ini() {
  tinac = setTimeout('location="index.asp"',600000); // 30 segundos
}
function parar() {
  clearTimeout(tinac);
  tinac = setTimeout('location="index.asp"',600000); // 30 segundos
}
function actualizar(){
window.location.reload();

}
</script>
</head>
<%
DIM oConn, sql, DG, DE
'Response.Write "Bienvenido <B>"& Session("cedula") &"</B>"

Set oConn = Server.CreateObject ("ADODB.Connection")
oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"

sql = "SELECT * FROM tbl_DGenerales WHERE cedula = '"& Session("cedula") &"'" ' Recuperar los valores que se encuentran registrados
Set DG = Server.CreateObject ("ADODB.RecordSet")
dg.Open sql, oConn
If (DG.EOF =false) then
pnombre= DG.FIELDS("pnombre")
snombre= DG.FIELDS("snombre")
papellido=DG.FIELDS("papellido")
sapellido=DG.FIELDS("sapellido")
lnac=DG.FIELDS("lugar_nac")
fnac=DG.FIELDS("fecha_nac")
nacionalidad=DG.FIELDS("nacionalidad")
inss=DG.FIELDS("inss")
ruc=DG.FIELDS("ruc")
estatura=DG.FIELDS("estatura")
peso=DG.FIELDS("peso")
licencia=DG.FIELDS("peso")
vlicencia=DG.FIELDS("licencia")
cat_licencia=DG.FIELDS("cat_licencia")
vehiculo=DG.FIELDS("vehiculo")
marca=DG.FIELDS("marca")
a_vehic=DG.FIELDS("ano_vehic")
celular=DG.FIELDS("celular")
telefono_dom=DG.FIELDS("telefono_dom")
departamento_dom=DG.FIELDS("departamento_dom")
ciudad_dom=DG.FIELDS("ciudad_dom")
direccion=DG.FIELDS("direccion_dom")
tipo_casa=DG.FIELDS("tipo_casa")
cbanco=DG.FIELDS("cuenta_banco")
banco=DG.FIELDS("banco")
no_cuenta=DG.FIELDS("no_cuenta")
ingreso=DG.FIELDS("ingreso")
puesto=DG.FIELDS("puesto")
salario_max=DG.FIELDS("salario_max")
salario_min=DG.FIELDS("salario_min")
turno=DG.FIELDS("turno")
vturno=DG.FIELDS("turno")
obs_horario=DG.FIELDS("obs_horario")
experiencia=DG.FIELDS("experiencia")
penfermedad=DG.FIELDS("penfermedad")
enfermedad=DG.FIELDS("enfermedad")
palergia=DG.FIELDS("palergia")
alergia=DG.FIELDS("alergia")
tsangre=DG.FIELDS("tsangre")
contacto_emer=DG.FIELDS("contacto_emer")
parentesco_cont=DG.FIELDS("parentesco_cont")
tel_contacto=DG.FIELDS("tel_contacto")
vpd=DG.FIELDS("p_deporte")
vtc=DG.FIELDS("t_tarjeta")
pasaporte=DG.FIELDS("pasaporte")
e_civil=DG.FIELDS("e_civil")
cargo=DG.FIELDS("puesto")
experiencia=DG.FIELDS("experiencia")
fec=year(DG.FIELDS("fecha_nac"))
if fec="1900" then
f_nac=""
else
f_nac=DG.FIELDS("fecha_nac")
end if
end if ' fin de recuperacion de registros
'Limpiamos y cerramos.
DG.Close
oConn.Close
set DG = Nothing
Set oConn = Nothing
%>

<body  onload="ini()" onkeypress="parar()" onclick="parar()" >
<form method="post"  style="border:0px " action="solicitud.asp"  name ="frmsolicitud" >
<input type="hidden" name="acciones" value="">
<input type="hidden" name="radiod" value="<%response.write(vpd)%>">
<input type="hidden" name="radiot" value="<%response.write(vtc)%>">
<center> <img src="img/Encab.png"/> </center>
<div id="contenido" >
<div id="instrucciones">
<p>&nbsp;</p>
<p>&nbsp;</p>
<table  border="0" align="center" width="60%" >

<th colspan="2"><div align="center">
  <p>INSTRUCCIONES</p>
  </div></th>
    </tr>
	<tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	<tr>
      <td colspan="2" height="35"> <p>ESTA SOLICITUD DEBE SER COMPLETADA EN SU TOTALIDAD. NO SE PUEDEN DEJAR ESPACIOS VACIOS. </p>
        <p>EN CASO QUE USTED DESCONOZCA LA TOTALIDAD DE ALGUNA INFORMACION SOLICITADA, POR FAVOR COMPLETAR ESPACIO CON N/A.</p>
        <p> LA INFORMACION QUE SEA DE SU CONOCIMIENTO PERO QUE EN EL MOMENTO DE LLENAR&nbsp; ESTE FORMATO USTED NO LA TIENE A MANO, POR FAVOR MARCAR CON ASTERISCO (*). </p></td>
    </tr>
  <tr>
      <td colspan="2"><div align="center"><hr></div></td>
    </tr>
	 <tr>
      <th   colspan="2" align="center" valign="top"><p><a href="#dgenerales">Iniciar</a></p>
        
      </th>
    </tr>
  </table>
</div>

<div id="dgenerales" >
      <table width="100%"   align="center" border="0"  >
        <tr align="center">
          <th width="588" align="left" onclick="javascript:ventana('instrucciones.asp')"> DATOS GENERALES </th>
          <td width="40" align="right">
            <input type="submit" name="Accion" value="<<" class="btn2" onclick="acciones.value='inicio'" /></td>
          <td width="40" align="right">
            <input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='dgenerales';return validar_dg(this.form);" />
</td>
        </tr>
      </table>
      <table width="714"  align="center" >

    <tr align="center">
      <th width="156"  align="center" scope="row">
        <label for="codemp">Primer Nombre </label>
      </th>
      <th width="205" align="center" scope="row">
        <label for="snombre">Segundo Nombre </label>
       </th>
      <th width="161"  align="center" scope="row">
        <label for="codemp">Primer Apellido </label>
      </th>
      <th width="172"  align="center" scope="row">
        <label for="snombre">Segundo Apellido </label>
     </th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" size="25" name="pnombre" id="pnombre"  class="txt" value="<%response.Write(pnombre)%>" maxlength="25" onkeypress="return Valida_Dato(event,6)" /></td>
      <td  align="center"  ><input type="text" name="snombre"  id="snombre" size="25"    class="txt"  value="<%response.Write(snombre)%>"  maxlength="25" onkeypress="return Valida_Dato(event,6)"   /></td>
      <td align="center"  ><input type="text" size="25" name="papellido" id="papellido" class="txt"  value="<%response.Write(papellido)%>" maxlength="25" onkeypress="return Valida_Dato(event,6)" /></td>
      <td align="center"   ><input type="text" name="sapellido"  id="sapellido" size="25"  class="txt" value="<%response.Write(sapellido)%>"  maxlength="25"onkeypress="return Valida_Dato(event,6)" /></td>
    </tr>	
	  <tr align="center">
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="codemp">Lugar de Nacimiento</label>
      </span></th>
      <th align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Fecha de Nacimiento (dd/mm/yyyy) </label>
      </span> </th>
      <th  align="center" scope="row">Nacionalidad<span class="Estilo11">
        <label for="codemp"></label>
      </span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">C&eacute;dula</label>
      </span> </th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" size="25" name="lugar_nac" id="lugar_nac"  class="txt" value="<%response.Write(lnac)%>" onkeypress="return Valida_Dato(event,6)"	/></td>
      <td  align="center"  ><input type="text" name="fecha_nac"  id="fnac" size="25" value="<%response.Write(f_nac)%>" onKeyPress="return Valida_Dato(event,5)"  onBlur="esFechaValida(this);" maxlength="12"  class="txt" /></td>
      <td align="center"  ><select id="select2" name="nacionalidad" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <option value="" <% if nacionalidad= "" then %> selected <% end if %> ></option>
        <option value="Arg"<% if nacionalidad=" Arg "then %> selected <% end if %> >Argentina</option>
        <option value="Bol"<% if nacionalidad=" Bol" then %> selected <% end if %> >Boliviana</option>
        <option value="Bra"<% if nacionalidad= "Bra" then %> selected <% end if %> >Brasileña</option>
        <option value="Chi"<% if nacionalidad= "Chi" then %> selected <% end if %> >Chilena</option>
        <option value="Col"<% if nacionalidad= "Col" then %> selected <% end if %> >Colombiana</option>
        <option value="Cub"<% if nacionalidad= "Cub" then %> selected <% end if %> >Cubana</option>
        <option value="Ecu"<% if nacionalidad= "Ecu" then %> selected <% end if %> >Ecuatoriana</option>
        <option value="Sv"<% if nacionalidad= "Sv"  then %> selected <% end if %> >Salvadoreña</option>
        <option value="Gua"<% if nacionalidad= "Gua" then %> selected <% end if %> >Guatemalteca</option>
        <option value="Hai"<% if nacionalidad= "Hai" then %> selected <% end if %> >Haitiana</option>
        <option value="Hon"<% if nacionalidad= "Hon" then %> selected <% end if %> >Hondureña</option>
        <option value="Mex"<% if nacionalidad= "Mex" then %> selected <% end if %> >Mexicana</option>
        <option value="Nic"<% if nacionalidad= "Nic" then %> selected <% end if %> >Nicaragüense</option>
        <option value="Pan"<% if nacionalidad= "Pan" then %> selected <% end if %> >Panameña</option>
        <option value="Par"<% if nacionalidad="Par" then %> selected <% end if %> >Paraguaya</option>
        <option value="Per"<% if nacionalidad= "Per" then %> selected <% end if %> >Peruana</option>
        <option value="Dom"<% if nacionalidad="Rep" then %> selected <% end if %> >Dominicana</option>
        <option value="Uru"<% if nacionalidad= "Uru" then %> selected <% end if %> >Uruguaya</option>
        <option value="Ven"<% if nacionalidad= "Ven" then %> selected <% end if %> >Venezolana</option>
        <option value="Eua"<% if nacionalidad="Eua" then %> selected <% end if %> >Estadounidense</option>
        <option value="Can"<% if nacionalidad= "Can" then %> selected <% end if %> >Canadiense</option>
      </select ></td>
      <td align="center"   ><input type="text" name="cedula"  id="cedula" size="25"  maxlength="150" readonly="readonly"   class="txt" value="<%response.Write(session("cedula"))%>"  /></td>
    </tr>	
	  	  <tr align="center">
      <th  align="center" scope="row">
        <label for="codemp">No. INSS </label>
     </th>
      <th align="center" scope="row">
        <label for="snombre">No. RUC </label>
     </th>
      <th  align="center" scope="row">Pasaporte</th>
      <th  align="center" scope="row">
        <label for="snombre">Estado Civil</label>
      </th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" size="25" name="inss" id="inss" onkeypress="return Valida_Dato(event,9)"  maxlength="15" class="txt" value="<%response.Write(inss)%>" /></td>
      <td  align="center"  ><input type="text" size="25" name="numruc" id="numruc" onkeypress="return Valida_Dato(event,9)"  maxlength="15" class="txt" value="<%response.Write(ruc)%>" /></td>
      <td align="center"  ><input type="text" size="25" name="pasaporte" id="pasaporte"  onkeypress="return Valida_Dato(event,9)" maxlength="15" class="txt" value="<%response.Write(pasaporte)%>" /></td>
      <td align="center"   > <select id="estado_civil" name="estado_civil" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
       <option value="" <% if e_civil= "" then %> selected <% end if %>></option>
       <option value="S"<% if e_civil= "S" then %> selected <% end if %>>Soltero(a)</option>
       <option value="A" <% if e_civil= "A" then%> selected <% end if %>>Acompañado(a)</option>
       <option value="C" <% if e_civil= "C" then%> selected <% end if %>>Casado(a) </option>
       <option value="V" <% if e_civil= "V" then %> selected <% end if %>>Viudo(a)</option>
     </select>
	  </td>
    </tr>
      <tr align="center">
      <th  align="center" scope="row">
        <label for="codemp">Tipo_Sangre</label></th>
      <th align="center" scope="row">
        <label for="snombre">Estatura (mts)</label>
     </th>
      <th  align="center" scope="row">Peso (lbrs)</th>
      <th  align="center" scope="row">Tiene Licencia</th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" size="25" name="tsangre" maxlength="3" id="tsangre"  onkeypress="return Valida_Dato(event,11)" class="txt"  value="<%response.Write(tsangre)%>"/></td>
      <td  align="center"  ><input type="text" name="estatura"  id="ruc" size="25"  maxlength="150"  onkeypress="return Valida_Dato(event,9)" class="txt" value="<%response.Write(estatura)%>" /></td>
      <td align="center"  ><input type="text" size="25" name="peso" id="peso"   class="txt" onkeypress="return Valida_Dato(event,9)" value="<%response.Write(peso)%>" /></td>
      <td align="center"   ><input type="radio" name="tlicencia" value="S" <% if vlicencia="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="frmsolicitud.cat_lic.selectedIndex=0;cat_lic.disabled=false;" /> Si
          <input type="radio" name="tlicencia" value="N"<% if vlicencia="N" then%> checked 
	  <% else %> unchecked  <% end if %> onClick="frmsolicitud.cat_lic.selectedIndex=9;cat_lic.disabled=true" />No</td></tr>
    <tr align="center">
      <th  align="center" scope="row">
        <label for="codemp">Categor&iacute;a_ Licencia</label></th>
      <th align="center" scope="row">
        <label for="snombre">Veh&iacute;culo Propio</label></th>
      <th  align="center" scope="row">Marca<span class="Estilo11"></th>
      <th  align="center" scope="row">
        <label for="snombre">A&ntilde;o</label>
      </th>
    </tr>
    <tr>
      <td align="center"  ><select id="select3" name="cat_lic"  style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" >
        <option value="" <% if cat_licencia= "" then %> selected <% end if %> ></option>
		<option value="M" <% if cat_licencia= "M" then %> selected <% end if %> >Motocicleta hasta 125cc</option>
        <option value="M+" <% if cat_licencia= "M+" then %> selected <% end if %> >Motocicleta mayor de 125cc</option>
        <option value="VL" <% if cat_licencia= "VL" then %> selected <% end if %> >Veh&iacute;culos livianos</option>
        <option value="V8t" <% if cat_licencia= "V8t" then %> selected <% end if %> >Veh&iacute;culos hasta 8 tn</option>
        <option value="V8P" <% if cat_licencia= "M8p" then %> selected <% end if %> >Buses hasta 12 pasajeros</option>
        <option value="B12" <% if cat_licencia= "B12" then %> selected <% end if %> >Buses + 12 pasajeros Esc.</option>
        <option value="CM" <% if cat_licencia= "CM" then %> selected <% end if %> >Camiones 2 ejes y m&aacute;s</option>
        <option value="VAC" <% if cat_licencia= "VAC" then %> selected <% end if %> >Veh&iacute;culos agr&iacute;colas y de Construcci&oacute;</option>
		<option value="N/A" <% if cat_licencia= "N/A" then %> selected <% end if %>>N/A</option>
      </select></td>
      <td  align="center"  ><input type="radio" name="vehiculo" value="S" <% if vehiculo="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="marca.disabled=false;ano_vehic.disabled=false" />        
        Si
          <input type="radio" name="vehiculo" value="N" <% if vehiculo="N" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="marca.value='N/A';marca.disabled=true; ano_vehic.value='N/A';ano_vehic.disabled=true" />
        No</td>
      <td align="center"  ><input type="text" size="25" name="marca" id="marca"  maxlenght="25"  class="txt"  value="<%response.Write(marca)%>" onkeypress="return Valida_Dato(event,6)"/></td>
      <td align="center"   ><input type="text" name="ano_vehic"  id="ano_vehic" size="25"  maxlength="4"  onKeyPress="return Valida_Dato(event,8)"  class="txt" value="<%response.Write(a_vehic)%>" /></td>
    </tr>
      	  <tr align="center">
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="codemp">Tel. Celular </label>
      </span></th>
      <th align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Tel. Domicilio</label></span></th>
      <th  align="center" scope="row">Departamento Domicilio<span class="Estilo11"></span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Ciudad Domicilio</label></span></th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" size="25" name="celular" id="celuar"  maxlength="8"  class="txt" onKeyPress="return Valida_Dato(event,9)" value="<%response.Write(celular)%>"/></td>
      <td  align="center"  ><input type="text" name="telefono"  id="telefono" size="25"  maxlength="8"  class="txt" onkeypress="return Valida_Dato(event,9)" value="<%response.Write(telefono_dom)%>" /></td>
      <td align="center"  ><input type="text" size="25" name="departamento_dom" id="departamento_dom"  class="txt" value="<%response.Write(departamento_dom)%>" onkeypress="return Valida_Dato(event,6)" /></td>
      <td align="center"   ><input type="text" name="ciudad_dom"  id="ciudad_dom" size="25"  maxlength="150"  class="txt" value="<%response.Write(ciudad_dom)%>" onkeypress="return Valida_Dato(event,6)" /></td>
    </tr>
    	  <tr align="center">
      <th  colspan="4" align="left" scope="row"><span class="Estilo11">
        <label for="codemp">Direcci&oacute;n</label></span></th>
     
    </tr>
    <tr>
      <td colspan="4" align="center"  ><input type="text"  size="140" name="direccion" id="direccion"  onkeypress="return Valida_Dato(event,9)" class="txt" value="<%response.Write(direccion)%>" /></td>
    </tr>
  <tr align="center">
      <th  align="center" scope="row"><span class="Estilo11">Cuenta Bancaria</span></th>
      <th align="center" scope="row">Banco<span class="Estilo11"></span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre2">No. de Cuenta</label>
      </span></th>
      <th  align="center" scope="row">Ingreso Familiar</th>
    </tr>
    <tr>
      <td align="center"  ><input type="radio" name="cuenta_banco" value="S"  <% if cbanco="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="banco.disabled=false;no_cuenta.disabled=false"/>
        <span class="Estilo11">Si</span>
        <input type="radio" name="cuenta_banco" value="N" <% if cbanco="N" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="banco.value='N/A';no_cuenta.value='N/A';banco.disabled=true;no_cuenta.disabled=true"/>
        <span class="Estilo11">No</span></td>
      <td  align="center"  ><input type="text" size="25" name="banco" id="banco"  class="txt" maxlength="40"  value="<%response.Write(banco)%>" onKeyPress="return Valida_Dato(event,9)" /></td>
      <td align="center"  ><input type="text" name="no_cuenta"  id="no_cuenta" size="25"  maxlength="45"  class="txt" onkeypress="return Valida_Dato(event,9)" value="<%response.Write(no_cuenta)%>" /></td>
      <td align="center"   ><select id="select6" name="ingreso" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456; " >
	      <option value=""  <% if ingreso= "" then %> selected <% end if %>></option>
        <option value="A"  <% if ingreso= "A" then %> selected <% end if %>>C$ 0.00 a 3,000.00</option>
        <option value="B" <% if ingreso= "B" then %> selected <% end if %>>C$ 3,000.01 a 9,000.00</option>
        <option value="C" <% if ingreso= "C" then %> selected <% end if %>>C$ 9,000.01 a 15,000.00</option>
        <option value="D" <% if ingreso= "D" then %> selected <% end if %>>C$ 15,000.01 a 20,000.00</option>
        <option value="E" <% if ingreso= "E" then %> selected <% end if %>>C$ 20,000.01 a 40,000.00</option>
    </select></td>
    </tr>
    <tr align="center">
      <th  align="center" scope="row">Padece Enfermedad</th>
      <th align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Especifique</label></span></th>
      <th  align="center" scope="row">Padece Alergia<span class="Estilo11"></span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Especifique</label></span></th>
    </tr>
    <tr>
      <td align="center"  ><input type="radio" name="penfermedad" value="S"  <% if penfermedad="S" then%> checked <% else %> unchecked  <% end if %> onClick="enfermedad.disabled=false" >
        <span class="Estilo11">Si</span>
        <input type="radio" name="penfermedad" value="N" <% if penfermedad="N" then%> checked <% else %> unchecked  <% end if %> onClick="enfermedad.value='N/A';enfermedad.disabled=true" > 
        <span class="Estilo11">No</span></td>
      <td  align="center"  ><input type="text" size="25" name="enfermedad" id="enfermedad"  maxlength="50" class="txt" value="<%response.Write(enfermedad)%>" onkeypress="return Valida_Dato(event,6)" /></td>
      <td align="center"  ><input type="radio" name="palergia" value="S" <% if palergia="S" then%> checked <% else %> unchecked  <% end if %> onClick="alergia.disabled=false" />
        <span class="Estilo11">Si</span>
        <input type="radio" name="palergia" value="N" <% if palergia="N" then%> checked <% else %> unchecked  <% end if %> onClick="alergia.value='N/A';alergia.disabled=true" />
        <span class="Estilo11">No</span></td>
      <td align="center"   ><input type="text" name="alergia"  id="alergia" size="25"  maxlength="50"  class="txt" value="<%response.Write(alergia)%>"  onkeypress="return Valida_Dato(event,6)" /></td>
    </tr>
       	  <tr align="center">
      <th  align="center" scope="row">Tipo de Casa</th>
      <th align="center" scope="row">En caso de emergencia contactar a:</th>
      <th  align="center" scope="row"> Parentesco       <span class="Estilo11"></span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Tel&eacute;fono</label></span></th>
    </tr>
    <tr>
      <td align="center"  ><select id="tipo_casa" name="tipo_casa"  style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;">
        <option value="" <% if tipo_casa= "" then %> selected <% end if %> ></option>
        <option value="P" <%if tipo_casa="P" then%> selected <%end if%> >Propia</option>
        <option value="A" <%if tipo_casa="A" then%> selected <%end if%>  >Alquilada</option>
        <option value="Am" <%if tipo_casa="Am" then%> selected <%end if%>  >Amortizando</option>
        <option value="F" <%if tipo_casa="F" then%> selected <%end if%>  >Familiar</option>
      </select></td>
      <td  align="center"  ><input type="text" name="contacto_emer"  id="contacto_emer" size="25"  maxlength="50"  class="txt" value="<%response.Write(contacto_emer)%>" onKeyPress="return Valida_Dato(event,6)"/></td>
      <td align="center"  >	  <select name="parentesco_cont"  id="parentesco_cont" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;width:140px;color: #456;" onblur="validacombo(this)" >
      <%		   'Dim Conp,qry, objp
		   Set Conp = Server.CreateObject("ADODB.Connection")
		   Conp.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Rseleccion;pwd=sel3Rh2011"
		   qry = "SELECT * FROM tbl_Parentesco order by descripcion"
		   Set objp = Conp.Execute(qry)
			while (not objp.Eof)%>
      <option value= <%response.write(objp("cod_parentesco"))%> <%if parentesco_cont=objp("cod_parentesco") then %> selected <% END IF %> >
      <%response.write(objp("descripcion"))%>
      </option>
      <% objp.MoveNext
		   wend
		   Conp.Close
		   set objp = nothing
		   set Conp = nothing
		   
       %>
    </select>	
	  </td>
      <td align="center"   ><input type="text" name="tel_contacto"  id="tel_contacto" size="25"  maxlength="25"  class="txt" value="<%response.Write(tel_contacto)%>"  /></td>
    </tr>
    
  </table>
 </div>
<div id="deportes">
  <table width="100%"   align="center" border="0"  >
    <tr align="center">
      <th width="588" align="left" onclick="javascript:ventana('instrucciones.asp')"> DATOS GENERALES </th>
	  <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2"  onclick="acciones.value='regdgenerales'" /> </td>
      <td width="40" align="right"><input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='dgrales';return validar_dgg(this.form)" /> </td>
    </tr>
  </table>
  <table width="714"  align="center">
<tr>
    <th width="165" height="27" align="left" scope="row"><span class="Estilo11">Practica Deporte:</span> </th>
    <td width="537"  align="left">
<input type="radio" name="deporte" id="deporte" value="S" <% if vpd="S" then%> checked <% else %> unchecked  <% end if %> onclick="catdeporte.disabled=false;radiod.value='S'"/>
<span class="Estilo11">Si</span>
      <input type="radio" name="deporte" id="deporte" value="N" <% if vpd="N" then%> checked 
	       <% else %> unchecked  <% end if %> onClick="catdeporte.disabled=true;radiod.value='N'">      
      <span class="Estilo11">No</span></td>
  </tr>
 
  <tr>
    <td height="27" colspan="2" ><span class="Estilo11">Qu&eacute; disciplina deportiva:</span>
        
      <select name="catdeporte" id="catdeporte"  <% if vpd<>"S" then%> disabled <% end if %> style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;" >
        <%
		   Dim Cond,qryd, objd
		  
		   Set Cond = Server.CreateObject("ADODB.Connection")
		   Cond.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo;uid=Rseleccion;pwd=sel3Rh2011"
		   qryd = "SELECT * FROM tbl_deportes order by descripcion desc"
		   Set objd = Cond.Execute(qryd)
			while (not objd.Eof)
			   response.write "<option value='" & objd("cod_deporte") & "'>" & objd("descripcion") & "</option>"
   	  	   objd.MoveNext
		   wend
		   
		   Cond.Close
		   set objd = nothing
		   set Cond = nothing
       %>
      </select> 
      <input type="submit" name="Accion" value="Agregar" class="btn2" onclick="acciones.value='DP'" />  
  </tr>
  <tr> </tr>

  <td height="47" colspan="2"><table align="center" width="35%"  border="1" bordercolor="#333333">
        <tr>
          <td align="center"><span class="Estilo11">Detalle Disciplinas Deportivas </span></td>
        </tr>
        <%
   'Dim Conn,strSQL, objDF
   'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234;database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   strSQL = "SELECT y.descripcion FROM  tbl_deportes y,tbl_reladeportes x where x.cod_deporte=y.cod_deporte and cedula = '"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td></tr>"
	        Response.Write(cadena)
      objDF.MoveNext
   wend
 
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
 </table></td>
   <tr>
    <th width="165" height="35" align="left" scope="row"><span class="Estilo11">Tiene Tarjeta de Cr&eacute;dito: </span> </th>
    <td colspan="3" align="left">
<input type="radio" name="tarjeta" id="tarjeta" value="S" <% if vtc="S" then%> checked 
	       <% else %> unchecked  <% end if %> onclick="bancos.disabled=false;radiot.value='S'" />      
<span class="Estilo11">Si</span>
      <input type="radio" name="tarjeta" id="tarejta" value="N" <% if vtc="N" then%> checked 
	       <% else %> unchecked  <% end if %> onClick="bancos.disabled=true;radiot.value='N'">
      <span class="Estilo11">No</span></td>
  </tr>
   <tr>
    <td height="27"  colspan="2" ><span class="Estilo11">Con qu&eacute; instituci&oacute;n bancaria 
        <select name="bancos" id="select" <%if vtc<>"S" then %> disabled <%end if%> style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
          <%
		   'Dim Conp,qry, objp
		   Set Conp = Server.CreateObject("ADODB.Connection")
		   Conp.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
		   qry = "SELECT * FROM tbl_bancos order by cod_banco desc"
		   Set objp = Conp.Execute(qry)
			while (not objp.Eof)
			   response.write "<option value='" & objp("cod_banco") & "'>" & objp("descripcion") & "</option>"
   	  	   objp.MoveNext
		   wend
		  Conp.Close
		   set objp = nothing
		   set Conp = nothing
       %>
        </select>
      <input type="submit" name="Accion" value="Agregar" class="btn2" onclick="acciones.value='DB'" />
</span></td>
      </tr>
    <tr>
    <td height="47" colspan="2"><table align="center" width="35%"  border="1" bordercolor="#333333">
        <tr>
         <td align="center"><span class="Estilo11">Detalle de Tarjetas de Cr&eacute;dito </span></td>
       </tr>
    <%
   'Dim Conn,strSQL, objDF
   'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "SELECT y.descripcion FROM  tbl_bancos y,tbl_relabanco x where x.cod_banco=y.cod_banco and cedula = '"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td></tr>"
	        Response.Write(cadena)
      objDF.MoveNext
   wend
   
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
    </table></td>
  </tr>
</table> 
 </div>
 <div id="dfamiliares">
 <table width="100%"   align="center" border="0"  >
 <tr align="center">
	   <th width="584" align="left" onclick="javascript:ventana('instrucciones.asp')">DATOS FAMILIARES </td>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2" onclick="acciones.value='regdeportes'"  /> </td>
	    <td width="40" align="right"><input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='dfamiliares'" />  </td>
  	</tr>
		 <tr align="center">
	 	    <td colspan="3"  align="left">Favor detallar nombres completos seg&uacute;n c&eacute;dula de Padre, Madre, C&oacute;nyuge, Hijos,Hermanos
           </td>
  	</tr>

	 <tr align="center">
	 	    <td colspan="3"  align="left">Los campos con (*) son requeridos. Favor completarlos.           </td>
  	</tr>
   
</table> 


 
 
  <table width="660"  border="0" align="center">
    <tr align="center">
      <th width="140"  align="center" scope="row"><span class="Estilo11">
        <label for="codemp">Primer Nombre * </label>
      </span></th>
      <th width="175" align="center" scope="row"><span class="Estilo11">
        <label for="label">Segundo Nombre* </label>
      </span></th>
      <th width="160"  align="center" scope="row">Primer Apellido * <span class="Estilo11"></span></th>
      <th width="167"  align="center" scope="row"><span class="Estilo11">
        <label for="label">Segundo Apellido * </label>
      </span></th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" name="Nom1_fam" id="Nom1_fam2"  class="txt"  onKeyUp="frmsolicitud.Nom1_fam.value=frmsolicitud.Nom1_fam.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" size="25 " maxlength="50" /></td>
      <td  align="center"  ><input type="text" name="Nom2_fam" id="Nom2_fam"  class="txt"   onKeyUp="frmsolicitud.Nom2_fam.value=frmsolicitud.Nom2_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="25 " maxlength="50" /></td>
      <td align="center"  ><input type="text" name="Apell1_fam" id="Apell1_fam"  class="txt"  onKeyUp="frmsolicitud.Apell1_fam.value=frmsolicitud.Apell1_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="25" maxlength="50" /></td>
      <td align="center"   ><input type="text" name="Apell2_fam" id="Apell2_fam"  class="txt"  onKeyUp="frmsolicitud.Apell2_fam.value=frmsolicitud.Apell2_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="25" maxlength="50" /></td>
    </tr>
    <tr align="center">
	 <th align="left" scope="row"><span class="Estilo11">
        <label for="codemp">Parentesco * </label>
      </span></th>
      <th  colspan="3" align="left" scope="row"><span class="Estilo11">
        <label for="codemp">Direcci&oacute;n</label>
        *
      </span></th>
    </tr>
	
    <tr>
	 <td align="center"  ><select name="Parent" id="Parent" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;color: #456; width:140px"  >
       <option value=""></option>
	   <option value="A">Abuelo(a)</option>
       <option value="P">Padre</option>
       <option value="M">Madre</option>
       <option value="H">Hijo</option>
       <option value="Hr">Hermano</option>
       <option value="C">Cónyuge</option>
	   <option value="T">Tio(a)</option>
	   <option value="Pr">Primo(a)</option>
	   <option value="Cu">Cuñado(a)</option>
	   <option value="Su">Suegro(a)</option>
	   
     </select></td>
	 <td colspan="3" align="center"  ><input type="text"  size="92" name="direccion_fam" id="direccion_fam" onKeyUp="frmsolicitud.direccion_fam.value=frmsolicitud.direccion_fam.value.toUpperCase();"  onkeypress="return Valida_Dato(event,9)" class="txt" /></td>
    </tr>
    <tr align="center">
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre2">Fecha Nacimiento</label>      
      </span></th>
      <th align="center" scope="row"><span class="Estilo11">Ocupaci&oacute;n</span></th>
      <th  align="center" scope="row"><span class="Estilo11">
        <label for="snombre2">Lugar de Trabajo</label>
      </span></th>
      <th  align="left" scope="row"><span class="Estilo11">Depende</span></th>
    </tr>
    <tr>
      <td align="center"  ><input type="text" name="fecnac_fam"  class="txt"  id="fecnac_fam" onkeypress="return Valida_Dato(event,5)"  onblur="esFechaValida(this);"  size="25 " maxlength="10" /></td>
      <td  align="center"  ><input type="text" name="ocupacion_fam"  class="txt"  id="ocupacion_fam"  onKeyUp="frmsolicitud.ocupacion_fam.value=frmsolicitud.ocupacion_fam.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="25 " maxlength="50" /></td>
      <td align="center"  ><input type="text" name="ltrabajo_fam"  class="txt"  id="ltrabajo_fam" onKeyUp="frmsolicitud.ltrabajo_fam.value=frmsolicitud.ltrabajo_fam.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" size="25 " maxlength="150" /></td>
      <td align="center"   >  <input type="radio" name="depende" value="S" >
      <span class="Estilo11">Si</span>
      <input type="radio" name="depende" value="N" />      
      <span class="Estilo11">No</span> <input type="submit" name="Accion" value="Agregar"  class="btn2" onclick="acciones.value='DF'" /></td></tr>
  </table>
  <strong>
<p> Detalle de Datos Familiares:</p></strong>
  <table align="center" width="96%" border=1 cellspacing=1 cellpadding=1 bordercolor="#333333">
    <tr>
      <td width="8%" align="center" valign="middle" class="Estilo11">Parentesco</td>
      <td width="10%" align="center" valign="middle"><span class="Estilo11">Nombres</span ></td>
      <td width="9%" align="center" valign="middle"><span class="Estilo11">Apellidos</span ></td>
      <td width="9%" align="center" valign="middle"><span class="Estilo11">Fecha Nacimiento</span ></td>
      <td width="5%" align="center" valign="middle"><span class="Estilo11">Dep.</span ></td>
	  <td width="11%" align="center" valign="middle"><span class="Estilo11">Ocupacion</span ></td>
	   <td width="11%" align="center" valign="middle"><span class="Estilo11">Lugar de Trabajo</span ></td>
      <td width="43%" align="center" valign="middle"><span class="Estilo11">Domicilio</span ></td>
	  <td width="5%" align="center" valign="middle"><span class="Estilo11">Acci&oacute;n</span ></td>
     
    </tr>
    <%
   Dim Conn,strSQL, objDF
   DIM NOMBRES,fec,f_nac
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
  
   strSQL = "SELECT a.id_df,b.descripcion, a.Nombres, a.Apellidos, year(a.f_nacimiento) anac, a.f_nacimiento, a.direccion, a.ocupacion, a.depende, a.l_trabajo FROM tbl_DFamiliares a,"
   strSQL= strSQL & " tbl_parentesco b where  b.cod_parentesco=a.parentesco and  a.cedula = '"& Session("cedula") &"'"
   	
	
   
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  fec=objDF("anac")
	if fec="1900" then
	fnac=""
	else
	fnac=objDF("f_nacimiento")
	end if
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td><td><span class=""Estilo12"">" & objDF("Nombres") & "</span ></td>"
	  cadena=cadena &"<td><span class=""Estilo12"">" & objDF("Apellidos") & "</span ></td><td><span class=""Estilo12"">" & fnac & "</span ></td>"
	  cadena=cadena & "<td><span class=""Estilo12"">" & objDF("Depende") & "</span ></td><td><span class=""Estilo12"">" & objDF("Ocupacion") & "</span ></td>"
	  cadena=cadena & "<td><span class=""Estilo12"">" & objDF("l_trabajo") & "</span ></td>" & "<td><span class=""Estilo12"">" & objDF("Direccion") & "</span ></td>"
	  cadena=cadena & " <td> <a href=""javascript:ventana('dfamiliar.asp?id= "& objDF("id_df")&"&msg=P')""><span class=""Estilo12"">Editar</span ></a></tr>"
	   
      Response.Write(cadena)
      objDF.MoveNext
   wend
   
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
  </table>
 
  <p></p>
</div>

<div id="dacademicos">
  <table width="100%"   align="center" border="0" >
 <tr align="center">
	   <th width="592"  align="left" onclick="javascript:ventana('instrucciones.asp')"> DATOS ACADEMICOS  </th>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2"   onclick="acciones.value='regdfamiliares'" /> </td>
	   <td width="40" align="right"><input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='dacademicos'" /> </td>
  	</tr>
    <tr align="center">
	 	    <td colspan="3"  align="left">Los campos con (*) son requeridos. Favor completarlos.</td>
  	</tr>
</table> 
 

  <table width="94%"  border="0">
    <tr> 
      <th align="left" ><span class="Estilo11">Estudio Realizado </span><span class="Estilo15">*</span></th>
      <td width="22%"><input type="text" name="titulo" size="30 "  class="txt"   onKeyUp="frmsolicitud.titulo.value=frmsolicitud.titulo.value.toUpperCase();" onKeyPress="return Valida_Dato(event,6)" maxlength="250" align="center"></td>
      <th width="17%" align="left"><span class="Estilo11">Nivel Acad&eacute;mico</span><span class="Estilo15">*</span></th>
      <td ><select id="nivel_aca"  size="" name="nivel_aca" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
	   <option value=""></option>
        <option value="P">Primaria</option>
        <option value="S">Secundaria</option>
        <option value="T">T&eacute;cnico</option>
		<option value="U">Universidad</option>
        <option value="Pg">Postgrado</option>
        <option value="M">Maestr&iacute;a</option>
        <option value="D">Doctorado</option>
      </select ></td>
       <th width="17%" align="right"><span class="Estilo11">Estado</span><span class="Estilo15">*</span></th>
      <td width="13%"><select id="estado_acad" name="estado_acad" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
       <option value=""></option>
	    <option value="10">Incompleto</option>
        <option value="20">Completo</option>
        <option value="30">En curso</option>
		<option value="40">Egresado</option>
        <option value="50">Titulado</option>
        
     </select></td>
    </tr>
    <tr>
       <th width="18%" align="left"><span class="Estilo11"> Instituci&oacute;n Educativa</span><span class="Estilo15">*</span></th>
       <td width="22%"><input type="text" name="institucion"  class="txt"  onkeyup="frmsolicitud.institucion.value=frmsolicitud.institucion.value.toUpperCase();" onkeypress="return Valida_Dato(event,6)" size="30" maxlength="150" align="center" /></td>
       <th align="left"><span class="Estilo11">Ultimo A&ntilde;o aprobado</span></th>
      <td width="13%"><select id="ano_acad" name="ano_acad" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
	   <option value=""></option>
        <option value="1º">Primero</option>
        <option value="2º">Segundo</option>
        <option value="3º">Tercero</option>
		<option value="4º">Cuarto</option>
        <option value="5º">Quinto</option>
        <option value="6º">Sexto</option>
      
      </select ></td>
       <th width="17%">Duraci&oacute;n
         <input type="text" name="duracion" id="duracion" class="txt"   size="10" maxlength="20" align="center" /></th>
       <td><input type="submit" name="Accion" value="Agregar" class="btn2" onClick="acciones.value='DA'"></td>
    </tr>
   
  </table>  <strong>
<p> Detalle de Datos Acad&eacute;micos:</p></strong>
  <table width="94%" border="1" align="center" bordercolor="#333333">
  <tr> 
    <td width="9%" scope="col" align="center" valign="middle"><span class="Estilo11">Nivel Acad&eacute;mico</span></td>
	<td width="26%" scope="col" align="center" valign="middle"><span class="Estilo11">T&iacute;tulo Obtenido</span></td>
    <td width="28%" scope="col" align="center" valign="middle"><span class="Estilo11">Instituci&oacute;n Educativa</span></td>
		<td width="10%" scope="col" align="center" valign="middle"><span class="Estilo11">Estado </span> </td>
	<td width="9%" scope="col" align="center" valign="middle"><span class="Estilo11"> &Uacute;ltimo a&ntilde;o aprobado</span> </td>
<td width="8%" scope="col" align="center" valign="middle"><span class="Estilo11">Duracion </span> </td>
<td width="10%" scope="col" align="center" valign="middle"><span class="Estilo11">Accion </span> </td>
	  </tr>
 <tr>
    <%
   'Dim Conn,strSQL, objDF
   'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select id_da,cedula, nivela=  cASE nivel_academico  WHEN 'P' THEN 'Primaria' WHEN 'S' THEN 'Secundaria' "
   strSQL = strSQL & " WHEN 'T' THEN 'Tecnico' WHEN 'U' THEN 'Universidad'  WHEN 'Pg' THEN 'Postgrado'	WHEN 'D' THEN 'Doctorado' 	WHEN 'M' THEN 'Master' "
   strSQL = strSQL & " ELSE '' END ,titulo, ESTADO1= CASE estado WHEN '10' THEN 'INCOMPLETO' WHEN '20' THEN 'COMPLETO' WHEN '30'  THEN 'EN CURSO'   WHEN '40'  THEN 'EGRESADO'  "
   strSQL = strSQL & " WHEN '50' THEN 'TITULADO'   WHEN '70' THEN 'BAJO' WHEN '80' THEN 'MEDIO' WHEN '90' THEN 'ALTO' ELSE '' END ,ult_ano_aprob,institucion,duracion from tbl_dacademicos where cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nivela") & "</span ></td><td><span class=""Estilo12"">" & objDF("titulo") & "</span ></td>"
	  cadena=cadena &"<td><span class=""Estilo12"">" & objDF("institucion") & "</span ></td><td><span class=""Estilo12"">" & objDF("estado1") & "</span ></td>"
	  cadena=cadena & "<td><span class=""Estilo12"">" & objDF("ult_ano_aprob") & "</span ></td>" & "<td><span class=""Estilo12"">" & objDF("duracion") & "</span ></td>"
	  cadena=cadena & "<td> <a href=""javascript:ventana('dacad.asp?id= "& objDF("id_da")&"&msg=DA')"" onmouseover=""window.status='Editar Datos';return true"" onmouseout=""window.status='Editar Datos';return true""><span class=""Estilo12"">Editar</span ></a></td> </tr>"
      Response.Write(cadena)
      objDF.MoveNext
   wend
  Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
 </table>
 <br> </br>
<p class="Estilo16"><strong>Registar Conocimiento de Idiomas: </strong></p>
<table width="84%" border="0" align="center">
 <tr>
  <td><span class="Estilo11">Seleccione Idioma </span><span class="Estilo15">*</span></td>
  <td><span class="Estilo11">Nivel Lectura (%) </span><span class="Estilo15">*</span></td>
  <td><span class="Estilo11">Nivel Escritura (%) </span><span class="Estilo15">*</span></td>
  <td><span class="Estilo11">Nivel Conversaci&oacute;n (%) </span><span class="Estilo15">*</span></td>
  <td></th>
 </tr>
 <tr> 
  <th width="123" height="30"><select name="idioma"  id="idioma" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
         <%
		   'Dim Conp,qry, objp
		   Set Conp = Server.CreateObject("ADODB.Connection")
		   Conp.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
		   
		   qry = "SELECT * FROM tbl_idiomas order by descripcion"
		   Set objp = Conp.Execute(qry)
			while (not objp.Eof)%>
			   <option value= <%response.write(objp("cod_idioma"))%> <%if vparentemer=objp("cod_idioma") then %> selected <% END IF %> > <%response.write(objp("descripcion"))%> </option>
   	  	  <% objp.MoveNext
		   wend
		  
		   Conp.Close
		   set objp = nothing
		   set Conp = nothing
       %>
        </select>
	</th>
	<th width="135" scope="col"><select id="nivl" name="nivl" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
	    <option value=""></option>
        <option value="0">0%</option>
	    <option value="10">10%</option>
        <option value="20">20%</option>
        <option value="30">30%</option>
		<option value="40">40%</option>
        <option value="50">50%</option>
        <option value="60">60%</option>
		<option value="70">70%</option>
		<option value="80">80%</option>
		<option value="90">90%</option>
		<option value="100">100%</option>
     </select></th>
	<th width="127" scope="col">
	  <select id="nive" name="nive" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
	    <option value=""></option>
        <option value="0">0%</option>
        <option value="10">10%</option>
        <option value="20">20%</option>
        <option value="30">30%</option>
        <option value="40">40%</option>
        <option value="50">50%</option>
        <option value="60">60%</option>
        <option value="70">70%</option>
        <option value="80">80%</option>
        <option value="90">90%</option>
        <option value="100">100%</option>
      </select>
	 </th>
	<th width="138" scope="col"><select id="nivc" name="nivc" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
	   <option value=""></option>
       <option value="0">0%</option>
	    <option value="10">10%</option>
        <option value="20">20%</option>
        <option value="30">30%</option>
		<option value="40">40%</option>
        <option value="50">50%</option>
        <option value="60">60%</option>
		<option value="70">70%</option>
		<option value="80">80%</option>
		<option value="90">90%</option>
		<option value="100">100%</option>
     </select></th>
	<td width="74"  colspan="5"><input type="submit" name="Accion" value="Agregar" class="btn2" onClick="acciones.value='DI'"></td>  
    </tr>
</table>
<strong><p>Detalle de Idiomas:</strong>
<table width="336" border="1" align="center">
  <tr> 
    <td width="115" scope="col"><span class="Estilo11">Idioma</span></td>
	<td width="54" scope="col"><span class="Estilo11">Nivel Lectura (%)</span></td>
    <td width="58" scope="col"><span class="Estilo11">Nivel Escritura (%) </span></td>
	<td width="81" scope="col"><span class="Estilo11"> Nivel Conversaci&oacute;n (%) </span></td>
  </tr>
 <tr>
    <%
   'Dim Conn,strSQL, objDF
   'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
  
   strSQL = "select a.*, b.descripcion from tbl_relaidiomas a, tbl_idiomas b  where b.cod_idioma= a.idioma and cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  idiomas=objDF("descripcion")
	  nlectura=objDF("nivel_lectura")
	  nescritura=objDF("nivel_lectura")
	  nconversacion=objDF("nivel_lectura")
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td><td align=""center""><span class=""Estilo12"">" & objDF("nivel_lectura") & "</span ></td>"
	  cadena=cadena &"<td align=""center""><span class=""Estilo12"">" & objDF("nivel_escritura") & "</span ></td><td align=""center""><span class=""Estilo12"">" & objDF("nivel_conversacion") & "</span ></td></tr>"
	  Response.Write(cadena)
	  
	  
      objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
 
</table>		
		
 
 
</table>
			
  
  
 
</div>
<div id="dlaborales" border="0">
  <table width="95%"   align="center" >
 <tr align="center">
	   <th align="left" onclick="javascript:ventana('instrucciones.asp')" > EXPERIENCIA LABORAL Y/O PASANTIAS</th>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2" onclick="acciones.value='regdacademicos'" /> </td>
	    <td width="40" align="right"> <input type="submit" name="Accion2" value=">>" class="btn2" onclick="acciones.value='elaboral'" /> </td>
  	</tr>
  <tr align="center">
	 	    <td colspan="3"  align="left">Los campos con (*) son requeridos. Favor completarlos.</td>
  	</tr>
</table> 

  <table width="704" border="0" align="center">
    <tr>
      <th width="71" scope="row" align="left"><span class="Estilo11"> Empresa</span><span class="Estilo15">*</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa"  class="txt"  onkeyup="frmsolicitud.ep_empresa.value=frmsolicitud.ep_empresa.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)"  size="50" maxlength="150" /></td>
      <th width="114" scope="row" align="left"><span class="Estilo11"> Puesto</span><span class="Estilo15">*</span></th>
      <td ><input type="text" name="ep_puesto"  class="txt"  onkeyup="frmsolicitud.ep_puesto.value=frmsolicitud.ep_puesto.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" /></td>
    </tr>
    <tr>
      <th width="71" scope="row" align="left"><span class="Estilo15">Area*</span></th>
      <td colspan="3" ><input type="text" name="ep_area"  class="txt"  onkeyup="frmsolicitud.ep_area.value=frmsolicitud.ep_area.value.toUpperCase();"  onkeypress="return Valida_Dato(event,9)"  size="50" maxlength="150" /></td>
      <th width="114" scope="row" align="left">Tel&eacute;fono*</th>
       <td ><input type="text" name="ep_telefono"  class="txt"   size="42" maxlength="16"  /></td>

    </tr>
    <tr>
      <th width="71" scope="row" align="left">Direcci&oacute;n<span class="Estilo15"></span><span class="Estilo15">*</span></th>
      <td colspan="5">        <input type="text" name="ep_direccion"  class="txt"  onkeyup="frmsolicitud.ep_direccion.value=frmsolicitud.ep_direccion.value.toUpperCase();"   onkeypress="return Valida_Dato(event,9)" size="120" maxlength="150" /></td>
    </tr>
     <tr>
      <th width="71" scope="row" align="left">Salario<span class="Estilo15">*</span></th>
      <td colspan="3" ><input type="text" name="ep_salario"  class="txt"  size="50" maxlength="150" /></td>
       <th width="114" scope="row" align="left">Jefe Inmediato<span class="Estilo15">*</th>
       <td ><input type="text" name="ep_jefe"  class="txt" size="42" maxlength="150" onkeyup="frmsolicitud.ep_jefe.value=frmsolicitud.ep_jefe.value.toUpperCase();" /></td>

    </tr>
	<tr>
      <th width="71" scope="row" align="left"><span class="Estilo11">F Inicio: (mm/yyyy) * </span></th>
      <th width="88"><input type="text" name="ep_finicio"  id="ep_finicio" size="12"  onkeypress="return Valida_Dato(event,5)"  onblur="FechaValida(this);" maxlength="7"  class="txt" /></th>
      <th width="86"><span class="Estilo11">F Fin : (mm/yyyy) </span><span class="Estilo15">* </span></th>
      <th width="97"><span class="Estilo15">
        <input type="text" name="ep_ffin" id= "ep_ffin" size="12 " onkeypress="return Valida_Dato(event,5)"  onblur="FechaValida(this);" maxlength="7"  class="txt" />
      </span></th>
      <th width="114" align="left" scope="row">Estado *       </th>
      <td width="238">        <strong><span class="Estilo16">
        <select id="ep_estado" name="ep_estado" style="width:90px;font-family:Verdana,Geneva, sans-serif; font-size:10px;color: #456;">
          <option value=""></option>
          <option value="A">Actual</option>
          <option value="U">&Uacute;ltimo</option>
          <option value="P">Pen&uacute;ltimo</option>
          <option value="AP">Antepen&uacute;ltimo</option>
        </select>            
        <input type="submit" name="Accion" value="Agregar" class="btn2" onclick="acciones.value='DL'" />
</span></strong></td></tr>
  </table>
  <br>
  </br>
  <%       'DIM NOMBRES
   dim id,empresa_ep,puesto_ep,direccion_ep,telefono_ep,area_ep,salario_ep,jefe_ep,finicio_ep,ffin_ep, estado_ep
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select * , month(f_inicio) mi, year(f_inicio) yi, month(f_final) mf, year(f_final) yf from tbl_eprofesional where estado = 'A' and cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	 id=objDF("id_ep")
	 empresa_ep=objDF("empresa")
	 puesto_ep=objDF("puesto")
	 direccion_ep=objDF("direccion")
	 telefono_ep=objDF("telefono")
	 area_ep=objDF("area")
	 salario_ep=objDF("salario")
	 jefe_ep=objDF("jefe_inmediato")
	 finicio_ep=objDF("f_inicio")
	 mmi=objDF("mi")
	 yyi=objDF("yi")
	 mmf=objDF("mf")
	 yyf=objDF("yf")
	 ffin_ep=" "
	 estado_ep=objDF("estado")
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
	  %>  
	     
  <table width="704" border="0" align="center">
    <tr>
     <th colspan="6" align="left">Empleo Actual</th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empres</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_act"   readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_act"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_act" readonly="readonly" class="txt"     size="50" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
      <td ><input type="text" name="ep_telefono_act" id="ep_telefono_act2" class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5">    <input type="text" name="ep_direccion_act" readonly="readonly" class="txt"  size="120" maxlength="150"  value="<%response.Write(direccion_ep)%>"/>
</td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_act" readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
      <th width="102" scope="row" align="left">Jefe Inmediato</th>
      <td ><input type="text" name="ep_jefe_act"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span><span class="Estilo15">*</span></th>
      <th width="93"><input type="text" name="ep_finicio_act"  id="ep_finicio_act" readonly="readonly" size="10"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="7"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span><span class="Estilo15">* </span></th>
      <th width="88"><span class="Estilo15">
        <input type="text" name="ep_ffin22" id= "ep_ffin22" size="12" readonly="readonly"value= "<%response.Write(ffin_ep & "N/A")%>" maxlength="7"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
      <%response.write(cadena)%>
    </tr>
  </table>
  <%'  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>

  </br>
  <%       'DIM NOMBRES
   dim id_u,empresa_u,puesto_u,direccion_u,telefono_u,area_u,salario_u,jefe_u,finicio_u,ffin_u, estado_u, mmi, yyi, mmf,yyf
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select *, month(f_inicio) mi, year(f_inicio) yi, month(f_final) mf, year(f_final) yf from tbl_eprofesional where estado = 'U' and cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	 id_u=objDF("id_ep")
	 empresa_u=objDF("empresa")
	 puesto_u=objDF("puesto")
	 direccion_u=objDF("direccion")
	 telefono_u=objDF("telefono")
	 area_u=objDF("area")
	 salario_u=objDF("salario")
	 jefe_u=objDF("jefe_inmediato")
	 finicio_u=objDF("f_inicio")
	 mmi=objDF("mi")
	 yyi=objDF("yi")
	 mmf=objDF("mf")
	 yyf=objDF("yf")
	 ffin_u=objDF("f_final")
	 estado_u=objDF("estado")
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
	  %>  
	     
  <table width="704" border="0"  align="center">
 <tr>
     <hr width="50%" align="center">
    </tr>
    
    <tr>
     <th colspan="6" align="left">Ultimo Empleo</th>
    </tr>
	 <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_ult"   readonly="readonly" class="txt"  size="48" maxlength="150" value= "<%response.Write(empresa_u)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_ult"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_u)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_ult" readonly="readonly" class="txt"     size="50" maxlength="150" value= "<%response.Write(area_u)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
      <td ><input type="text" name="ep_telefono_ult" id="ep_telefono_ult2"   class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_u)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5"><input type="text" name="ep_direccion_ult" readonly="readonly" class="txt"  size="120" maxlength="150"  value="<%response.Write(direccion_u)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_ult" readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(salario_u)%>"/></td>
      <th width="102" scope="row" align="left">Jefe Inmediato</th>
      <td ><input type="text" name="ep_jefe_ult"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_u)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_ult"  id="ep_finicio_ult2" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span><span class="Estilo15">* </span></th>
      <th width="88"><span class="Estilo15">
        <input type="text" name="ep_ffin_ult" id= "ep_ffin_ult2" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
      <%response.write(cadena)%>
    </tr>
  </table>
  <%'  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>
  </br>
  <%       'DIM NOMBRES
   'dim id,empresa_ep,puesto_ep,direccion_ep,telefono_ep,area_ep,salario_ep,jefe_ep,finicio_ep,ffin_ep, estado_ep
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select * , month(f_inicio) mi, year(f_inicio) yi, month(f_final) mf, year(f_final) yf from tbl_eprofesional where estado = 'P' and cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	 id=objDF("id_ep")
	 empresa_ep=objDF("empresa")
	 puesto_ep=objDF("puesto")
	 direccion_ep=objDF("direccion")
	 telefono_ep=objDF("telefono")
	 area_ep=objDF("area")
	 salario_ep=objDF("salario")
	 jefe_ep=objDF("jefe_inmediato")
	 finicio_ep=objDF("f_inicio")
	 mmi=objDF("mi")
	 yyi=objDF("yi")
	 mmf=objDF("mf")
	 yyf=objDF("yf")
	 ffin_ep=objDF("f_final")
	 estado_ep=objDF("estado")
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
	  %>  
  <table width="704" border="0" align="center">
    <tr>
     <hr width="50%" align="center">
    </tr>
     <tr>
     <hr width="50%" align="center">
    </tr>
	<tr>
      <th colspan="6" align="left">Pen&uacute;ltimo Empleo </th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_pen"   readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_pen"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_pen" readonly="readonly" class="txt"     size="50" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
      <td ><input type="text" name="ep_telefono_pen"  class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5">
        <input type="text" name="ep_direccion_pen" readonly="readonly" class="txt"  size="120" maxlength="150"  value="<%response.Write(direccion_ep)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_pen" readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
      <th width="102" scope="row" align="left">Jefe Inmediato<span class="Estilo15"></span></th>
      <td ><input type="text" name="ep_jefe_pen"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_pen"  id="ep_finicio_pen2" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span><span class="Estilo15">* </span></th>
      <th width="88"><span class="Estilo15">
        <input type="text" name="ep_ffin_pen" id= "ep_ffin_pen" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
      <%response.write(cadena)%>
    </tr>
  </table>
  <%'  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>
  </br>
  <%       'DIM NOMBRES
   'dim id,empresa_ep,puesto_ep,direccion_ep,telefono_ep,area_ep,salario_ep,jefe_ep,finicio_ep,ffin_ep, estado_ep
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select * , month(f_inicio) mi, year(f_inicio) yi, month(f_final) mf, year(f_final) yf from tbl_eprofesional where estado = 'AP' and cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	 id=objDF("id_ep")
	 empresa_ep=objDF("empresa")
	 puesto_ep=objDF("puesto")
	 direccion_ep=objDF("direccion")
	 telefono_ep=objDF("telefono")
	 area_ep=objDF("area")
	 salario_ep=objDF("salario")
	 jefe_ep=objDF("jefe_inmediato")
	 finicio_ep=objDF("f_inicio")
	 mmi=objDF("mi")
	 yyi=objDF("yi")
	 mmf=objDF("mf")
	 yyf=objDF("yf")
	 ffin_ep=objDF("f_final")
	 estado_ep=objDF("estado")
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
	  %>  
	     
  <table width="704" border="0" align="center">
     <tr>
     <hr width="50%" align="center">
    </tr>
    <tr>
      <th colspan="6" align="left">Antepenúltimo</th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_ant"   readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td width="214" ><input type="text" name="ep_puesto_ant"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_ant" readonly="readonly" class="txt"     size="50" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
      <td ><input type="text" name="ep_telefono_ant"  id="ep_telefono_ant2"  class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5"><input type="text" name="ep_direccion_ant" readonly="readonly" class="txt"  size="120" maxlength="150"  value="<%response.Write(direccion_ep)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_ant" readonly="readonly" class="txt"  size="50" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
      <th width="102" scope="row" align="left">Jefe Inmediato</th>
      <td ><input type="text" name="ep_jefe_ant"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_ant"  id="ep_finicio_ant2" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="90"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span></th>
      <th width="91"><span class="Estilo15">
        <input type="text" name="ep_ffin_ant" id= "ep_ffin_ant2" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
      <%response.write(cadena)%>
    </tr>
  </table>
  <%'  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>		       
    </div>
<div id="puesto">
<table width="100%"   align="center" border="0" >
 <tr align="center">
	   <th align="left" onclick="javascript:ventana('instrucciones.asp')" > PUESTO QUE SOLICITA</th>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2" onclick="acciones.value='regdlaborales'" /> </td>
	      <td width="40" align="right"> <input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='puesto';return validar_puesto(this.form);" /></td>
  	</tr>
 
</table> 

<table width="704" border="0">
  <tr>
    <th width="197" scope="row" align="left"><span class="Estilo11"> Puesto al que Aplica</span></th>
    <td colspan="3"><input type="text" name="puesto" id="puesto"  onkeyup="frmsolicitud.puesto.value=frmsolicitud.puesto.value.toUpperCase();" class="txt"  size="80" maxlength="50"  value="<%response.Write(cargo)%>" onkeypress="return Valida_Dato(event,6)"/></td>
  </tr>
  <tr>
    <th width="197" scope="row" align="left">Aspiraci&oacute;n Salarial:</th>
    <td width="83"><input type="text" name="salario_max" id="salario_max"  class="txt" size="12" maxlength="50" value="<%response.Write(salario_max)%>" onkeypress="return Valida_Dato(event,4)" /></td>
    <th width="211" align="right" scope="row"><span class="Estilo11">Acepto  M&iacute;nimo:</span></th>
    <td width="195"><input type="text" name="salario_min"  id="salario_min" class="txt" size="12" maxlength="150" value="<%response.Write(salario_min)%>" onkeypress="return Valida_Dato(event,4)" /></td>
  </tr>
  <tr>
    <th width="197" scope="row" align="left">Acepta Horario en turno Rotativo:</th>
    <td width="83"><input type="radio" name="turno" value="S" <% if vturno="S" then%> checked <% else %> unchecked  <% end if %>/>
        <span class="Estilo11">Si</span>
        <input type="radio" name="turno" value="N" <% if vturno="N" then%> checked <% else %> unchecked  <% end if %> />
        <span class="Estilo11">No</span></td>
    <th width="211" align="right" scope="row"><span class="Estilo11">Tiene alg&uacute;n compromiso de horario:</span><span class="Estilo15">*</span></th>
    <td width="195"><input type="text" name="obs_horario"  class="txt"  size="35" maxlength="50" onKeyUp="frmsolicitud.obs_horario.value=frmsolicitud.obs_horario.value.toUpperCase();" value="<%response.Write(obs_horario)%>" onkeypress="return Valida_Dato(event,9)" /></td>
  </tr>
  <tr>
    <th width="197" scope="row" align="left"><span class="Estilo11">Resuma su Experiencia Laboral</span><span class="Estilo15"> (M&aacute;ximo 500 caracteres) 
      
    </span></th>
    <td colspan="3"><p>
      <textarea name="experiencia" cols="94" rows="8" id="experiencia" onKeyDown="textCounter(this.form.experiencia,this.form.remLen,500);" onKeyUp="textCounter(this.form.experiencia,this.form.remLen,500);frmsolicitud.experiencia.value=frmsolicitud.experiencia.value.toUpperCase();" onkeypress="return Valida_Dato(event,9)"><%response.write(experiencia)%></textarea>
    </p>      </td>
  </tr>
  <tr>
  <td height="2"  align="right"colspan="4">Texto Disponible<input readonly type="text" name="remLen" size="3" maxlength="3" value="500" /> </td></tr>
</table>

</div>
<div id="referencias">
  <table width="100%"   align="center" border="0" >
 <tr align="center">
	   <th width="583" align="left" onclick="javascript:ventana('instrucciones.asp')">REFERENCIAS PERSONALES </th>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2"  onclick="acciones.value='regpuesto'"/> </td>
	   <td width="40" align="right"> <input type="submit" name="Accion" value=">>" class="btn2" onclick="acciones.value='referenciasl'" /> </td>
  	</tr>
  <tr align="center">
	 	    <td colspan="3"  align="left"><p><strong>Tres referencias de personas que lo conozcan hace m&aacute;s de 3 a&ntilde;os. Ninguna relaci&oacute;n familiar. (Pueden ser vecinos, amigos o conocidos).</strong></p> 	        </td></tr>

			<tr align="center">
			 <td colspan="3"  align="left">Los campos con (*) son requeridos. Favor completarlos.
 	        </td>
  	</tr>
</table> 

<table width="714" border="0">
  <tr>
    <th width="157" align="left">Nombres y Apellidos*</th>
    <td colspan="5"><input type="text" name="ref_nombres"  class="txt" onKeyUp="frmsolicitud.ref_nombres.value=frmsolicitud.ref_nombres.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)"  size="80" maxlength="150"></td>
    </tr>
  <tr>
    <th align="left">Direcci&oacute;n*</th>
    <td colspan="5"><input type="text" name="ref_direccion" class="txt"  onKeyUp="frmsolicitud.ref_direccion.value=frmsolicitud.ref_direccion.value.toUpperCase();"   onkeypress="return Valida_Dato(event,9)"size="80" maxlength="150"></td>
    </tr>
  <tr>
    <th align="left">Empresa donde Trabaja*</th>
    <td colspan="5"><input type="text" name="ref_empresa" class="txt"  onkeyup="frmsolicitud.ref_empresa.value=frmsolicitud.ref_empresa.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" size="80" maxlength="150" /></td>
  </tr>
  <tr>
    <th height="32" align="left" valign="top">Edad*</th>
    <td width="77" valign="top"><input type="text" name="ref_edad" class="txt"  size="12" maxlength="2"></td>
    <th width="51" valign="top">Tel&eacute;fono</th>
    <td width="82" valign="top"><input type="text" name="ref_telefono" class="txt"  size="12" maxlength="16"></td>
    <th width="180" valign="top">Parentesco
     <select name="ref_parentesco" id="ref_parentesco" style="font-family:Verdana, Geneva, sans-serif; font-size:10px;color: #456;"  >
      <option value=""></option>
        <option value="Am">Amigo</option>
        <option value="V">Vecino</option>
        <option value="Co">Conocido</option>      </select>
	 </th>
    <td width="141" valign="top"> <strong><span class="Estilo16">
        <input type="submit" name="Accion" value="Agregar" class="btn2"  onclick="acciones.value='DR'" />
    </span></strong></td></tr>
</table>

 <table width="92%" border="1" align="center" bordercolor="#333333">
              <tr>
                <td width="186" scope="col"><span class="Estilo11">Nombre Completo</span></td>
                <td width="158" scope="col">Direcci&oacute;n</td>
                <td width="101" scope="col"><span class="Estilo11">Empresa </span></td>
                <td width="61" scope="col"><span class="Estilo11"> Edad </span></td>
                <td width="61" scope="col"><span class="Estilo11"> Tel&eacute;fono</span></td>
    			<td width="61" scope="col"><span class="Estilo11"> Parentesco</span></td>
				<td width="61" scope="col"><span class="Estilo11"> Editar</span></td>
              </tr>
          <%       'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   
   strSQL = "select a.*, b.descripcion from tbl_referencias a, tbl_parentesco b where a.tipo_relacion=b.cod_parentesco and interno='N' AND cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nombre_Completo") & "</span ></td><td ><span class=""Estilo12"">" & objDF("direccion") & "</span ></td>"
	  cadena=cadena &"<td ><span class=""Estilo12"">" & objDF("empresa") & "</span ></td><td ><span class=""Estilo12"">" & objDF("edad") & "</span ></td>"
	  cadena=cadena & "<td ><span class=""Estilo12"">" & objDF("telefono") & "</span ></td>" & "<td ><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td>"
	  cadena=cadena & "<td><a href=""javascript:ventana('referencias.asp?id= "& objDF("id_ref")&"&msg=E')"" <span class=""Estilo12"">Editar</span ></a></td> </tr>"
	  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>		 
			  
	  </table>  

</div>

<div id="refinternas">
  <table width="100%"   align="center" border="0" >
 <tr align="center">
	   <th width="583" align="left"  onclick="javascript:ventana('instrucciones.asp')">REFERENCIAS </th>
	    <td width="40" align="right"><input type="submit" name="Accion" value="<<" class="btn2" onclick="acciones.value='regreferencias'"  /> </td>
	   <td width="40" align="right"> <input type="submit" name="Accion" value="Inicio" class="btn2" onclick="acciones.value='refenciasi'" /> </td>
  	</tr>
	
	<tr align="center">
	 	    <td colspan="3"  align="left"><p><strong>Personas que lo conozcan que actualmente laboren para esta empresa.</strong></p> 	        </td></tr>

			<tr align="center">
			 <td colspan="3"  align="left">Los campos con (*) son requeridos. Favor completarlos.
 	        </td>
  	</tr>
 
</table> 

<table width="714" border="0">
  <tr>
    <th width="157" align="left">Nombres y Apellidos*</th>
    <td colspan="5"><input type="text" name="ref_nombre2"  id="ref_nombre2" class="txt"  onKeyUp="frmsolicitud.ref_nombre2.value=frmsolicitud.ref_nombre2.value.toUpperCase();"  onkeypress="return Valida_Dato(event,6)" size="80" maxlength="150"></td>
    </tr>
  <tr>
    
  <tr>
    <th align="left">Edad*</th>
    <td width="77"><input type="text" name="ref_edad2" class="txt"    size="12" maxlength="2" /></td>
    <th width="51">Tel&eacute;fono*</th>
    <td width="82"><input type="text" name="ref_tel2" class="txt" size="12" maxlength="16" /></td>
    <td width="249"> <strong><span class="Estilo16">
        <input type="submit" name="Accion" value="Agregar" class="btn2" onclick="acciones.value='DRI'" />
    </span></strong></td></tr>
</table>
<table width="92%" border="1" align="center" bordercolor="#333333">
              <tr>
                <td width="391" scope="col"><span class="Estilo11">Nombre Completo</span></th>
                <td width="116" scope="col">Edad</td>
                <td width="156" scope="col"><span class="Estilo11">Telefono</span></td>
				<td width="15" scope="col"><span class="Estilo11">Accion</span></td>
              </tr>
<%       'DIM NOMBRES
  Set Conn = Server.CreateObject("ADODB.Connection")
  Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
  strSQL = "select * from tbl_referencias where interno='Y' and cedula='"& Session("cedula") &"'"
  Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nombre_Completo") & "</span ></td>"
	  cadena=cadena &"<td ><span class=""Estilo12"">" & objDF("edad") & "</span ></td>"
	  cadena=cadena & "<td ><span class=""Estilo12"">" & objDF("telefono") & "</span ></td>" 
	  cadena=cadena & " <td><a href=""javascript:ventana('referencias.asp?id= "& objDF("id_ref")&"&msg=I')"" <span class=""Estilo12"">Editar</span ></a></td></tr>"
	  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>		 
</table>  
<p>&nbsp; </p>
<table width="647" border="0" align="center">
		<tr align="center" valign="middle">
		    <td ><input type="submit" name="Accion"  class="btn"  value="SALIR" onClick="acciones.value='Salir'" ></td>
		</tr>
	</table>
 </div>

</div>
</form >	
</body>
</html>
<%
if Request.ServerVariables("REQUEST_METHOD") = "POST" then
Dim Accion,sqlstring,fecha, exp
Accion = Request.Form("Acciones")
Set oConn = Server.CreateObject("ADODB.Connection")
oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
'CONDICION PARA EVITAR QUE APAREZCA FECHA POR DEFECTO EN EL SISTEMA
'response.Write("este es el valro" & request.form("cat_lic"))
f_nac=Request.Form("fecha_nac")

exp= request.form("experiencia")
if len (request.form("marca"))=0 then
mvehiculo="N/A"
else
mvehiculo=request.form("marca")
end if 

if len (request.form("ano_vehic"))=0 then
avehic="N/A"
else
avehic=request.form("ano_vehic")
end if 

if len (request.form("banco"))=0 then
bco="N/A"
else
bco=request.form("banco")
end if 

if len (request.form("no_cuenta"))=0 then
ncuenta="N/A"
else
ncuenta=request.form("no_cuenta")
end if 
if len (request.form("enfermedad"))=0 then
enf="N/A"
else
enf=request.form("enfermedad")
end if 
if len (request.form("alergia"))=0 then
alerg="N/A"
else
alerg=request.form("alergia")
end if 

if len (request.form("cat_lic"))=0 then
cl="N/A"
else
cl=request.form("cat_lic")
end if 
'VALIDACION DE ACCIONES A REALIZAR SEGUN OPCION DEL USUARIO
' GR: GRABAR REGISTRO
if accion="dgenerales" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
	sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring & "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring & "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & cl & "','" &Request.Form("vehiculo") & "','" & ucase(mvehiculo)
	sqlstring= sqlstring &  "','" & avehic & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" & bco & "','" & ncuenta & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"& ucase(ltrim(Request.Form("experiencia"))) &  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(enf)&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(alerg) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	response.Write(sqlstring)
	oConn.Execute(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#deportes")	
elseif accion="dgrales" then
      'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring & "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & cl & "','" &Request.Form("vehiculo") & "','" & ucase(mvehiculo)
	sqlstring= sqlstring &  "','" & avehic & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" & bco & "','" & ncuenta & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(rtrim(ltrim(Request.Form("experiencia"))))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(enf)&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(alerg) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	'response.Write(sqlstring)
	oConn.Execute(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#dfamiliares")	
elseif accion="puesto" then
      'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & cl & "','" &Request.Form("vehiculo") & "','" & ucase(mvehiculo)
	sqlstring= sqlstring &  "','" & avehic & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" & bco & "','" & ncuenta & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(rtrim(ltrim(Request.Form("experiencia"))))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(enf)&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(alerg) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	'response.Write(sqlstring)
	oConn.Execute(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#referencias")		
elseif accion="dfamiliares" then
	Response.Redirect("solicitud.asp#dacademicos")	
elseif accion="dacademicos" then
	Response.Redirect("solicitud.asp#dlaborales")	
elseif accion="elaboral" then
	Response.Redirect("solicitud.asp#puesto")	
elseif accion="referenciasl" then
	Response.Redirect("solicitud.asp#refinternas")	
elseif accion="referenciasi" then
	Response.Redirect("solicitud.asp#dgenerales")	
elseif accion="regreferencias" then
	Response.Redirect("solicitud.asp#referencias")	
elseif accion="regdgenerales" then
    Response.Redirect("solicitud.asp#dgenerales")
elseif accion="regdeportes" then
    Response.Redirect("solicitud.asp#deportes")
elseif accion="regdfamiliares" then
    Response.Redirect("solicitud.asp#dfamiliares")	
elseif accion="regdacademicos" then
	 Response.Redirect("solicitud.asp#dacademicos")	
elseif accion="regdlaborales" then
	 Response.Redirect("solicitud.asp#dlaborales")	
elseif accion="regpuesto" then
 	  Response.Redirect("solicitud.asp#puesto")	
elseif accion="GR" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#refinternas")	

' DP: INSERTAR UN NUEVO REGISTRO DE DEPORTE
elseif accion="DP" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	'response.Write(sqlstring) 08112013
	oConn.Execute(sqlstring)
	'Primero valida que el deporte no esté regsitrado
			 sql= "SELECT * FROM TBL_RELADEPORTES WHERE Cedula='" & session("cedula") & "' AND COD_DEPORTE='" & Request.Form("catdeporte") & "'"
			 Set DB=Server.CreateObject ("ADODB.RecordSet")
			 'response.Write(sql)
			 DB.open sql, oConn
			 IF (DB.EOF=True) then
				'ahora grabamos el requistro relacionado al deporte
		 	 	strSQL= "insert into tbl_reladeportes values ('" & session("cedula") & "','" & Request.Form("catdeporte") & "')"
				oConn.Execute(strSQL)
				oConn.Close
				set oConn = nothing
				RESPONSE.Redirect("solicitud.asp#deportes")	
			else
			 %>
     			 <script language="javascript">
      				<!--
      				 window.alert ("Ya existe el registro");
     				 location.href="solicitud.asp#deportes"
      				//-->
     			 </script>
			
			<%
			end if	
'INSERTAR REGISTRO DE BANCOS
elseif accion="DB" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
		'Primero valida que el banco no esté regsitrado
			 sql= "SELECT * FROM TBL_RELABANCO WHERE Cedula='" & session("cedula") & "' AND COD_BANCO='" & Request.Form("bancos") & "'"
			 Set DB=Server.CreateObject ("ADODB.RecordSet")
			 DB.open sql, oConn
			 IF (DB.EOF=True) then
				strSQL= "insert into tbl_relabanco values ('" & session("cedula") & "','" & Request.Form("bancos") & "')"
				oConn.Execute(strSQL)
				oConn.Close
				set oConn = nothing
				Response.Redirect("solicitud.asp#deportes")
			 ELSE              
			  %>
     			 <script language="javascript">
      				<!--
      				 window.alert ("Ya existe el registro");
     				 location.href="solicitud.asp#deportes"
      				//-->
     			 </script>
			
			<% END IF 
'REGISTRAR DATOS FAMILIARES			
elseif accion="DF" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	' response.write(sqlstring)
	oConn.Execute(sqlstring)
			IF   Request.Form("Nom1_fam") <> ""  AND  Request.Form("Apell1_fam" ) <> ""  AND Request.Form("Parent" ) <> ""  THEN
			'ahora insertamos el registro de dato familiar
			 strSQL = "SET DATEFORMAT dmy;"
    			 strSQL = strSQL & "insert into tbl_DFamiliares (cedula, parentesco, nombres,apellidos,ocupacion,f_nacimiento,direccion,depende,l_trabajo) " 
			 strSQL=  strSQL & "values ('"& session("cedula") & "','"&Request.Form("Parent" ) &"','" & Request.Form("Nom1_fam") & " " & Request.form("nom2_fam") &  "','"
			 strSQL= strSQL & Request.Form("Apell1_fam" ) & " " & Request.Form("Apell2_fam")  &"','" &  Request.Form("ocupacion_fam" ) & "','" &  Request.Form("fecnac_fam" ) &  "','" 
			 strSQL= strSQL & Request.Form("direccion_fam" ) &"','" &  Request.Form("depende" ) &"','" &  Request.Form("ltrabajo_fam" ) & "')"
			 'response.write(strSQL)
			 oConn.Execute(strSQL)
			 oConn.Close
			 set oConn = nothing
			 Response.Redirect("solicitud.asp#dfamiliares")
 ELSE	 
%>
     			 <script language="javascript">
      				<!--
      				window.alert ("Completar los campos requeridos");
					location.href="solicitud.asp#dfamiliares"
      				//-->
     			 </script>
<%
			 Response.Redirect("solicitud.asp#dfamiliares")
 end if 	
'INSERTAR REGISTROS ACADEMICO	S		   
elseif accion="DA" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
IF   Request.Form("titulo") <> ""  AND  Request.Form("nivel_aca" ) <> ""  AND Request.Form("estado_acad" ) <> "" AND Request.Form("institucion" ) <> "" THEN
	'ahora insertamos el registro academico
	 strSQL = "insert into tbl_dacademicos(cedula, nivel_academico,titulo,estado, ult_ano_aprob, institucion,duracion)" 
	 strSQL=  strSQL & "values ('"& session("cedula") & "','"& Request.Form("nivel_aca" ) &"','"&Request.Form("titulo") &  "','"
	 strSQL= strSQL & Request.Form("estado_acad" ) &"','" &  Request.Form("ano_acad" ) & "','" &  Request.Form("institucion") & "','" & Request.Form("duracion" ) & "')"
	 oConn.Execute(strSQL)
	 oConn.Close
	 set oConn = nothing
	 Response.Redirect("solicitud.asp#dacademicos")
 ELSE	 
%>     			 <script language="javascript">
      				<!--
      				window.alert ("Completar los campos requeridos");
					document.location.href="solicitud.asp#dacademicos";
					location.href="solicitud.asp#dacademicos";
      				//-->
     			 </script>
<%
 Response.Redirect("solicitud.asp#dacademicos")
END IF 
  
elseif accion="DI" then
   'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
	'ahora insertamos el registro academico
	
	IF Request.Form("IDIOMA") <> "" AND Request.Form("nivl")<>""  AND Request.Form("nive") <>"" AND Request.Form("nivc")<>""  THEN
			IF  Request.Form("nivl")<>"0"  OR Request.Form("nive") <>"0" OR Request.Form("nivc")<>"0"  THEN
					 'PRIMERO VALIDAMOS QUE NO EXISTA EL REGISTRO
				  strSQL= "SELECT * FROM tbl_RELAIDIOMAS WHERE CEDULA='" & SESSION("cedula") & "' AND IDIOMA='" & Request.Form("IDIOMA") & "'"
				   Set DB=Server.CreateObject ("ADODB.RecordSet")
				  DB.open strSQL, oConn
					  IF (DB.EOF=True) then
							strSQL = "INSERT INTO tbl_RELAIDIOMAS VALUES('" & session("cedula") & "','" 
							lectura= Request.Form("nivl")
							escritura=  Request.Form("nive")
							conversa=  Request.Form("nivc")
							strSQL= strSQL & Request.Form("IDIOMA") & "','" &  lectura & "','" & escritura & "','" &conversa & "')" 
					   	    oConn.Execute(strSQL)
						    oConn.Close
							set oConn = nothing
						    Response.Redirect("solicitud.asp#dacademicos")
					 ELSE
					  %>
							 <script language="javascript">
								<!--
								 window.alert ("Ya existe el registro");
								 location.href="solicitud.asp#dacademicos"
								//-->
							 </script>
			
						<%
					 END IF	
				ELSE
				 %>
			 		<script language="javascript">
					<!--
				 	window.alert ("Complete los datos");
				 	location.href="solicitud.asp#dacademicos"
					//-->
			 		</script>
		          <%	
				END IF
			ELSE	
				Response.Redirect("solicitud.asp#dacademicos")
			END IF

'INSERTAR REGISTROS DE EXPERIENCIA LABORAL
elseif accion="DL" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring &  "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
	'ahora insertamos el registro experiencia profesional
   IF REQUEST.FORM("EP_ESTADO")<>"A" then 
	   IF  Request.Form("ep_empresa") <> ""  AND  Request.Form("ep_puesto" ) <> ""  AND Request.Form("ep_area" ) <> "" AND Request.Form("ep_finicio" ) <> ""AND Request.Form("ep_ffin" ) <> "" THEN
			  strsql = "SET DATEFORMAT dmy;"
			  strSQL= strSQL & "insert into tbl_eprofesional (cedula,empresa,puesto,area,f_inicio,f_final,telefono,direccion,salario,jefe_inmediato,estado) values('" & session("cedula") & "','" & request.form("ep_empresa")& "','" & request.form("ep_puesto") 
			  strSQL= strSQL & "','" & request.form("ep_area") & "','01/" & request.form("ep_finicio") & "','01/" & request.form("ep_ffin")  & "','" 
			  strSQL= strSQL & request.form("ep_telefono") & "','"& request.form("ep_direccion") & "','"& request.form("ep_salario") & "','"& request.form("ep_jefe")  & "','"& request.form("ep_estado") & "')"
			   'response.Write(strSQL)
			   oConn.Execute(strSQL)
			  oConn.Close
			  set oConn = nothing
			Response.Redirect("solicitud.asp#dlaborales")
	   END IF
	ELSEIF REQUEST.FORM("EP_ESTADO")="A" THEN	
      IF  Request.Form("ep_empresa") <> ""  AND  Request.Form("ep_puesto" ) <> ""  AND Request.Form("ep_area" ) <> "" AND Request.Form("ep_finicio" ) <> "" THEN
			  trsql = "SET DATEFORMAT dmy;"
			  strSQL= strSQL & "insert into tbl_eprofesional (cedula,empresa,puesto,area,f_inicio,f_final,telefono,direccion,salario,jefe_inmediato,estado) values('" & session("cedula") & "','" & request.form("ep_empresa")& "','" & request.form("ep_puesto") 
			  strSQL= strSQL & "','" & request.form("ep_area") & "','01/" & request.form("ep_finicio") & "','','" 
			  strSQL= strSQL & request.form("ep_telefono") & "','"& request.form("ep_direccion") & "','"& request.form("ep_salario") & "','"& request.form("ep_jefe")  & "','"& request.form("ep_estado") & "')"
			  'response.Write(strSQL)
			  oConn.Execute(strSQL)
			  oConn.Close
			  set oConn = nothing
			  Response.Redirect("solicitud.asp#dlaborales")
   	  ELSE
	         Response.Redirect("solicitud.asp#dlaborales")
	  END IF
	  Response.Redirect("solicitud.asp#dlaborales")
END IF 
 Response.Redirect("solicitud.asp#dlaborales")
'insertar referencias
 elseif accion="DR" then
   'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring & "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
	 IF   Request.Form("ref_nombres") <> ""  AND  Request.Form("ref_direccion" ) <> ""  AND Request.Form("ref_empresa" ) <> "" AND Request.Form("ref_edad" ) <> ""AND Request.Form("ref_telefono" ) <> "" AND Request.Form("ref_parentesco" ) <> "" THEN
	'ahora insertamos el registro experiencia profesional
    sqlstring="insert into tbl_referencias(cedula,nombre_completo,direccion,empresa, edad,telefono,tipo_relacion,interno) values ('"
	sqlstring= sqlstring & session("cedula")& "','" & request.form("ref_nombres") & "','" & request.form("ref_direccion") & "','" & request.form("ref_empresa")
	sqlstring= sqlstring & "','" & request.form("ref_edad") & "','" & request.form("ref_telefono") & "','" & request.form("ref_parentesco")
	sqlstring=sqlstring & "','N')"
 	oConn.Execute(sqlstring)
   ' response.write(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#referencias")
 ELSE	 
%>
     			 <script language="javascript">
				 
      				<!--
      				window.alert ("Completar los campos requeridos");
					location.href="solicitud.asp#referencias"
      				//-->
     			 </script>
<%
Response.Redirect("solicitud.asp#referencias")
END IF 
 elseif accion="DRI" then
  'primero borramos de la tabla
	sqlstring="delete from tbl_dgenerales where cedula='"& session("cedula") & "'"
	oConn.Execute(sqlstring)
  ' grabamos los datos generales
    sqlstring = "SET DATEFORMAT dmy;"
    	sqlstring = sqlstring & "insert into tbl_dgenerales(pnombre,snombre,papellido,sapellido, lugar_nac, fecha_nac,nacionalidad, cedula, inss, ruc,"
   	sqlstring = sqlstring &  "estatura,peso, licencia, cat_licencia, vehiculo, marca, ano_vehic,celular, telefono_dom, departamento_dom,"     
   	sqlstring= sqlstring & "ciudad_dom,direccion_dom,tipo_casa,cuenta_banco,banco,no_cuenta,ingreso,puesto,salario_max,salario_min,turno,obs_horario,"
   	sqlstring= sqlstring & " experiencia, penfermedad,enfermedad,palergia, alergia,tsangre,contacto_emer,parentesco_cont,"
   	sqlstring= sqlstring & "tel_contacto,p_deporte,t_tarjeta,pasaporte,e_civil,fecha_sol)"
	sqlstring= sqlstring & "values ('"& ucase(Request.Form("pnombre")) & "','" & ucase(Request.Form("snombre")) & "','"& ucase(Request.Form("papellido")) & "','" 
	sqlstring= sqlstring  & ucase(Request.Form("sapellido")) & "','" & ucase(Request.Form("lugar_nac")) & "','" & f_nac 
	sqlstring= sqlstring &  "','" & Request.Form("nacionalidad") & "','" & ucase(Request.Form("cedula")) & "','" & ucase(Request.Form("inss"))
	sqlstring= sqlstring &  "','" & ucase(Request.Form("numruc")) & "','" & Request.Form("estatura") & "','" & Request.Form("peso")
	sqlstring= sqlstring &  "','" & Request.Form("tlicencia") & "','" & Request.Form("cat_lic") & "','" &Request.Form("vehiculo") & "','" & ucase(Request.Form("marca"))
	sqlstring= sqlstring &  "','" & Request.Form("ano_vehic") & "','" & Request.Form("celular") & "','" & Request.Form("telefono")
	sqlstring= sqlstring &  "','" & ucase(Request.Form("departamento_dom")) & "','" & ucase(Request.Form("ciudad_dom")) & "','" 
	sqlstring= sqlstring &  ucase(Request.Form ("direccion")) & "','" & Request.Form("tipo_casa") & "','"  & Request.Form("cuenta_banco") 
	sqlstring= sqlstring &  "','" &Request.Form("banco") & "','" & Request.Form("no_cuenta") & "','" &  Request.Form("ingreso")
	sqlstring= sqlstring & "','" &  ucase(Request.Form("puesto")) & "','" & Request.Form("salario_max") &  "','" & Request.Form("salario_min") &  "','" & Request.Form("turno")  
	sqlstring= sqlstring  & "','"& ucase(Request.Form("obs_horario"))& "','"&  ucase(ltrim(Request.Form("experiencia")))&  "','" & ucase(Request.Form("penfermedad"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("enfermedad"))&  "','" & ucase(Request.Form("palergia")) &  "','" & ucase(Request.Form("alergia")) &  "','" 
	sqlstring= sqlstring & ucase(Request.Form("tsangre")) &  "','" & ucase(Request.Form("contacto_emer")) &  "','" & ucase(Request.Form("parentesco_cont"))
	sqlstring= sqlstring & "','" & ucase(Request.Form("tel_contacto")) &  "','" & ucase(Request.Form("deporte")) &  "','" & ucase(Request.Form("tarjeta")) 
	sqlstring= sqlstring &  "','" & ucase(Request.Form("pasaporte")) & "','" & ucase(Request.Form("estado_civil"))& "','" & Now() & "')"
	oConn.Execute(sqlstring)
	'ahora insertamos el registro experiencia profesional
     IF   Request.Form("ref_nombre2") <> ""  AND Request.Form("ref_edad2" ) <> "" AND Request.Form("ref_tel2" )<> "" THEN
    sqlstring="insert into tbl_referencias(cedula,nombre_completo, edad,telefono,interno) values ('"
	sqlstring= sqlstring & session("cedula")& "','" & request.form("ref_nombre2") & "','" & request.form("ref_edad2") & "','" 
	sqlstring= sqlstring & request.form("ref_tel2") & "','Y')"
 	oConn.Execute(sqlstring)
   ' response.write(sqlstring)
	oConn.Close
	set oConn = nothing
	Response.Redirect("solicitud.asp#refinternas")
		ELSE	 
%>
     			 <script language="javascript">
      				<!--
      				window.alert ("Completar los campos requeridos");
					location.href="solicitud.asp#referencias"
      				//-->
     			 </script>
<%
Response.Redirect("solicitud.asp#referencias")
end if
 elseif accion="Salir" then
 	Session.Abandon
 	Session.Contents.RemoveAll()
 	Response.Redirect("index.asp")
 end if
 
end if

%>