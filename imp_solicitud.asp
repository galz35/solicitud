<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" type="text/css" href="css/estilo.css" />
<script type="text/javascript" src="js/funciones.js"></script>
<title>Solicitud de Empleo</title>
<style type="text/css">
<!--
body,td,th {
	color: #000;
}
.Estilo2 {color: #000000}
.Estilo10{ color:#FFFFFF}
-->
</style>
	
</head>
<%
DIM oConn, sql, DG, DE
'Response.Write "Bienvenido <B>"& Session("cedula") &"</B>"



Set oConn = Server.CreateObject ("ADODB.Connection")
oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
sql = "SELECT * FROM tbl_DGenerales WHERE cedula = '"& Session("cedula") &"'" ' Recuperar los valores que se encuentran registrados
Set DG = Server.CreateObject ("ADODB.RecordSet")
dg.Open sql, oConn
'response.write(session("cedula"))
If (DG.EOF =false) then
pnombre= DG.FIELDS("pnombre")
snombre= DG.FIELDS("snombre")
papellido=DG.FIELDS("papellido")
sapellido=DG.FIELDS("sapellido")
lnac=DG.FIELDS("lugar_nac")
fnac=DG.FIELDS("fecha_nac")
edad= int((Now()- fnac)/365)
vnac=DG.FIELDS("nacionalidad")
inss=DG.FIELDS("inss")
ruc=DG.FIELDS("ruc")
estatura=DG.FIELDS("estatura")
peso=DG.FIELDS("peso")
vlicencia=DG.FIELDS("licencia")
vcatlic=DG.FIELDS("cat_licencia")
vehiculo=DG.FIELDS("vehiculo")
marca=DG.FIELDS("marca")
a_vehic=DG.FIELDS("ano_vehic")
celular=DG.FIELDS("celular")
telefono_dom=DG.FIELDS("telefono_dom")
departamento_dom=DG.FIELDS("departamento_dom")
ciudad_dom=DG.FIELDS("ciudad_dom")
direccion=DG.FIELDS("direccion_dom")
vtcasa=DG.FIELDS("tipo_casa")
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
vcivil=DG.FIELDS("e_civil")
cargo=DG.FIELDS("puesto")
experiencia=DG.FIELDS("experiencia")
fec=year(DG.FIELDS("fecha_nac"))
fecsol=DG.FIELDS("fecha_sol")
if fec="1900" then
fnac=""
end if
else
response.Redirect("index.asp?errorusuario=si")

end if ' fin de recuperacion de registros

'Limpiamos y cerramos.
DG.Close
oConn.Close
set DG = Nothing
Set oConn = Nothing
%>


<body>
<form method="post"  style="border:0px " action="solicitud.asp"  name ="frmsolicitud" >
  <input type="hidden" name="acciones" value="">
  <table width="90%"   align="center" border="0" >
    <tr>
	<td colspan="2"><h2 class="Estilo2">Solicitud de Empleo</h2>
	  </td>
	</tr>
	<tr align="center" bgcolor="#CCCCCC">
      <th width="588" height="19" align="left"><span class="Estilo2"> DATOS GENERALES  </span></th>
	    <td width="114" align="right">  </td>
  	</tr>
  </table>

  <table width="73%"   align="center" border="0"  >

    <tr align="center">
      <td  colspan="3" align="left" scope="row">
        <label for="codemp">Nombre Completo </label>
      </td>
     
      <td width="244"  align="center" scope="row">
        <label for="snombre">C&eacute;dula</label>
     </td>
    </tr>
    <tr>
      <td align="left"  colspan="3" ><input type="text" size="115" name="pnombre" id="pnombre"  readonly="readonly" class="txt" value="<%response.Write(pnombre & " " & snombre & " " & papellido & " " & sapellido)%>" maxlength="80"  <% if pnombre=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td align="center"   ><input type="text" name="cedula"  id="cedula" size="25"  readonly="readonly" maxlength="150"   class="txt" value="<%response.Write(session("cedula"))%>"   <% if session("cedula")=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
    </tr>	
	  <tr align="center">
      <td width="157"  align="left" scope="row"><span class="Estilo11">
        <label for="codemp">Lugar de Nacimiento</label>
      </span></td>
      <td width="175" align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Fecha de Nacimiento (dd/mm/yyyy) </label>
      </span> </td>
      <td width="172"  align="center" scope="row"><span class="Estilo11">
        <label for="codemp">Edad</label>
      </span></td>
      <td  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Nacionalidad </label>
      </span> </td>
    </tr>
    <tr>
      <td align="left"  ><input type="text" size="25" name="lugar_nac" id="lugar_nac2"  readonly="readonly" class="txt" value="<%response.Write(lnac)%>"  <% if lnac=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td  align="center"  ><input type="text" name="fecha_nac"  id="fecha_nac" size="25" readonly="readonly"  maxlength="12"  class="txt"  value="<%response.Write(fnac)%>"   <% if fnac=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <%
		  if vnac="Arg" then  nacionalidad="ARGENTINA" end if
          if vnac="Bol"  then  nacionalidad="BOLIVIANA" end if
          if vnac= "Bra"  then  nacionalidad="BRASILEÑA" end if
          if vnac= "Chi"  then  nacionalidad="CHILENA" end if
          if vnac= "Col"  then  nacionalidad="COLOMBIANA" end if 
          if vnac= "Cub"  then  nacionalidad="CUBANA"  end if
          if vnac= "Ecu"  then  nacionalidad="ECUATORIANA" end if
          if vnac= "Sv"   then  nacionalidad="SALVADOREÑA" end if
          if vnac= "Gua"  then  nacionalidad="GUATEMALTECA" end if
          if vnac= "Hai"  then  nacionalidad="HAITIANA" end if
          if vnac= "Hon"  then  nacionalidad="HONDUREÑA" end if 
          if vnac= "Mex"  then  nacionalidad="MEXICANA" end if
          if vnac= "Nic"  then  nacionalidad="NICARAGUENSE" end if 
          if vnac= "Pan"  then  nacionalidad="PANAMEÑA" end if
          if vnac="Par"   then  nacionalidad="PARAGUAYA" end if 
          if vnac= "Per"  then  nacionalidad="PERUANA" end if
          if vnac="Rep"   then  nacionalidad="DOMINICANA" end if 
          if vnac= "Uru"  then  nacionalidad= "URUGUAYA" end if
          if vnac= "Ven"  then  nacionalidad="VENEZOLANA" end if
          if vnac="Eua"   then  nacionalidad="ESTADOUNIDENSE" end if
          if vnac= "Can"  then  nacionalidad="CANADIENSE" end if
	%>
	  <td align="center"  ><input type="text" name="fecha_nac2"  id="fecha_nac2" size="25" readonly="readonly"  maxlength="12"  class="txt"  value="<%response.Write(edad)%>"   <% if fnac=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/> </td>
      <td align="center"   ><input type="text" name="nac" id="nac2"     readonly="readonly" size="25" class="txt" maxlength="9" value="<%response.write(nacionalidad)%>"  <% if nacionalidad=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> /></td>
    </tr>	
	  	  <tr align="center">
      <td  align="left" scope="row">
        <label for="codemp">No. INSS </label>
     </td>
      <td align="center" scope="row">
        <label for="snombre">No. RUC </label>
     </td>
      <td  align="center" scope="row">Pasaporte</td>
      <td  align="center" scope="row">
        <label for="snombre">Estado Civil</label>
      </td>
    </tr>
    <tr>
      <td align="left"  ><input type="text" size="25" name="inss" id="inss" <% if inss=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>  readonly="readonly" onKeyPress="return Valida_Dato(event,8)"  maxlength="15" class="txt" value="<%response.Write(inss)%>"/></td>
      <td  align="center"  ><input type="text" name="ruc"  id="ruc" size="25"  <% if ruc=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> readonly="readonly" maxlength="15" onkeypress="return IngresaNumero(event)"  class="txt"  value="<%response.Write(ruc)%>" /></td>
      <td align="center"  ><input type="text" size="25" name="pasaporte" id="pasaporte" readonly="readonly" maxlength="15" <% if pasaporte=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> class="txt" value="<%response.Write(pasaporte)%>"/></td>
	 <% if vcivil= "S" then ecivil="Soltero(a)" end if
        if vcivil= "A" then ecivil="Acompañado(a)" end if
        if vcivil= "C" then ecivil="Casado(a)" end if
        if vcivil= "V" then ecivil="Viudo(a)" end if
     %>
	  <td align="center"   ><input type="text" name="estcivil" id="estcivil"  <% if ecivil=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>   class="txt"  readonly="readonly" size="25" maxlength="9" value="<%response.write(ecivil)%>" /></td>
    </tr>
      <tr align="center">
      <td  align="left" scope="row">
        <label for="codemp">Tipo_Sangre</label></td>
      <td align="center" scope="row">
        <label for="snombre">Estatura (mts)</label>
     </td>
      <td  align="center" scope="row">Peso (lbrs)</td>
      <td  align="center" scope="row">Tiene Licencia</td>
    </tr>
    <tr>
      <td align="left" ><input type="text" size="25" name="tsangre" id="tsangre" readonly="readonly" <% if tsangre=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> onkeypress="return Valida_Dato(event,11)" class="txt"  value="<%response.Write(tsangre)%>"/></td>
      <td  align="center"  ><input type="text" name="estatura"  id="ruc" size="25" readonly="readonly" maxlength="150" <% if tsangre=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>  onKeyPress="return Valida_Dato(event,4)" class="txt" value="<%response.Write(estatura)%>" /></td>
      <td align="center"  ><input type="text" size="25" name="peso" id="peso"   class="txt" <% if peso=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>  readonly="readonly" onKeyPress="return Valida_Dato(event,4)" value="<%response.Write(peso)%>" /></td>
      <td align="center"   ><input type="radio" name="tlicencia" disabled="true" readonly="readonly" value="S"  <%if vlicencia="" then%> style="background-color:#CC0000 " <%end if%> <% if vlicencia="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onclick="cat_lic.disabled=false;" /> 
        Si
      <input type="radio" name="tlicencia"  disabled="true" value="N" <%if vlicencia="" then%> style="background-color:#CC0000 " <%end if%><% if vlicencia="N" then%> checked 
	  <% else %> unchecked  <% end if %> onClick="cat_lic.disabled=true" />No</td></tr>
    <tr align="center">
      <td align="left" scope="row">
        <label for="codemp">Categor&iacute;a_ Licencia</label></td>
      <td align="center" scope="row">
        <label for="snombre">Veh&iacute;culo Propio</label></td>
      <td  align="center" scope="row">Marca<span class="Estilo11"></td>
      <td  align="center" scope="row">
        <label for="snombre">A&ntilde;o</label>
      </td>
    </tr>
    <tr>      <% 	if vcatlic= "M" then vcatlic= "Motocicleta hasta 125cc" end if
      		if vcatlic= "M+" then  vcatlic= "Motocicleta mayor de 125cc" end if
			if vcatlic= "VL" then   vcatlic= "Veh&iacute;culos livianos" end if
        	if vcatlic= "V8t" then   vcatlic= "Veh&iacute;culos hasta 8 tn" end if
       		if vcatlic= "V8p" then   vcatlic= "Buses hasta 12 pasajeros" end if
        	if vcatlic= "B12" then  vcatlic= "Buses + 12 pasajeros Esc." end if
       		if vcatlic= "CM" then   vcatlic= "Camiones 2 ejes y m&aacute;s" end if
       		if vcatlic= "VAC" then    vcatlic= "Veh&iacute;culos agr&iacute;colas y de Construcci&oacute;n" end if
   %>     
     
      <td align="left"  > <input type="text" name="cat_lic" readonly="readonly"  <% if vcatlic=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>   class="txt" size="25"  maxlength="15" value="<%response.write(vcatlic)%>" ></td>
      <td  align="center"  ><input type="radio" name="vehiculo" disabled="true" value="S" <%if vehiculo="" then%> style="background-color:#CC0000 " <%end if%> <% if vehiculo="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="marca.disabled=false;ano_vehic.disabled=false" />        
        Si
          <input type="radio" name="vehiculo" value="N" disabled="true" <%if vehiculo="" then%> style="background-color:#CC0000 " <%end if%> <% if vehiculo="N" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="marca.disabled=true;ano_vehic.disabled=true" />
        No</td><td align="center"  ><input type="text" size="25" name="marca" id="marca"  readonly="readonly" maxlenght="25"  <% if marca=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> class="txt"  value="<%response.Write(marca)%>"/></td>
      <td align="center"   ><input type="text" name="ano_vehic"  id="ano_vehic" size="25" readonly="readonly" maxlength="4"   <% if a_vehic=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> onKeyPress="return Valida_Dato(event,8)"  class="txt" value="<%response.Write(a_vehic)%>"/></td>
    </tr>
      	  <tr align="center">
      <td  align="left" scope="row"><span class="Estilo11">
        <label for="codemp">Tel. Celular </label>
      </span></td>
      <td align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Tel. Domicilio</label></span></td>
      <td  align="center" scope="row">Departamento Domicilio<span class="Estilo11"></span></td>
      <td  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Ciudad Domicilio</label></span></td>
    </tr>
    <tr>
      <td align="left" ><input type="text" size="25" name="celular" id="celuar"  maxlength="8"  readonly="readonly" class="txt"  value="<%response.Write(celular)%>"  <% if celular=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td  align="center"  ><input type="text" name="telefono"  id="telefono" size="25"  readonly="readonly" maxlength="8"  class="txt" value="<%response.Write(telefono_dom)%>"  <% if telefono_dom=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td align="center"  ><input type="text" size="25" name="departamento_dom" id="departamento_do"  readonly="readonly" class="txt" value="<%response.Write(departamento_dom)%>"  <% if departamento_dom=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td align="center"   ><input type="text" name="ciudad_dom"  id="ciudad_dom" size="25"  readonly="readonly" maxlength="150"  class="txt" value="<%response.Write(ciudad_dom)%>"  <% if ciudad_dom=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> /></td>
    </tr>
    	  <tr align="center">
      <td colspan="4" align="left" scope="row"><span class="Estilo11">
        <label for="codemp">    Direcci&oacute;n</label></span></td>
     
    </tr>
    <tr>
      <td colspan="4" align="center"  ><input type="text"  size="152" name="direccion" id="direccion2"  readonly="readonly" class="txt" value="<%response.Write(direccion)%>"  <% if direccion=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
    </tr>
  <tr align="center">
      <td align="left" scope="row"><span class="Estilo11">Cuenta Bancaria</span></td>
      <td align="center" scope="row">Banco<span class="Estilo11"></span></td>
      <td  align="center" scope="row"><span class="Estilo11">
        <label for="snombre2">No. de Cuenta</label>
      </span></td>
      <td  align="center" scope="row">Ingreso Familiar</td>
    </tr>
    <tr>
      <td align="center"  ><input type="radio" name="cuenta_banco" value="S" disabled="true" <%if cbanco="" then%> style="background-color:#CC0000 " <%end if%> <% if cbanco="S" then%> checked 
	  <% else %> unchecked  <% end if %>  onclick="banco.disabled=false;no_cuenta.disabled=false"/>        <span class="Estilo11">Si</span>
        <input type="radio" name="cuenta_banco" value="N" disabled="true" <%if cbanco="" then%> style="background-color:#CC0000 " <%end if%> <% if cbanco="N" then%> checked 
	  <% else %> unchecked  <% end if %>  onClick="banco.disabled=true;no_cuenta.disabled=true"/>
      <span class="Estilo11">No</span></td><td  align="center"  ><input type="text" size="25" name="banco" id="banco" readonly="readonly"  class="txt"  value="<%response.Write(banco)%>"  <% if banco=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
      <td align="center"  ><input type="text" name="no_cuenta"  id="no_cuenta" readonly="readonly" size="25"  maxlength="150"  class="txt" value="<%response.Write(no_cuenta)%>"  <% if no_cuenta=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
       <% 
        if ingreso= "A" then  ingreso="C$ 0.00 a 3,000.00" end if
        if ingreso= "B" then  ingreso="C$ 3,000.01 a 9,000.00" end if
		if ingreso= "C" then  ingreso="C$ 9,000.01 a 14,000.00" end if
        if vingreso= "D" then ingreso="C$ 15,000.01 a 20,000.00" end if
        if ingreso= "E" then  ingreso="C$ 20,000.01 a 40,000.00" end if %>
	  <td align="center"   ><input type="ingreso" name="ingreso"  readonly="readonly"   class="txt" size="25" maxlength="50" value="<%response.write(ingreso)%>"  <% if ingreso=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
    </tr>
    <tr align="center">
      <td  align="left" scope="row">Padece Enfermedad</td>
      <td align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Especifique</label></span></td>
      <td  align="center" scope="row">Padece Alergia<span class="Estilo11"></span></td>
      <td  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Especifique</label></span></td>
    </tr>
    <tr>
      <td align="center"  ><input type="radio" name="penfermedad" value="S" disabled="true" <%if penfermedad="" then%> style="background-color:#CC0000 " <%end if%> <% if penfermedad="S" then%> checked <% else %> unchecked  <% end if %> onClick="enfermedad.disabled=false" >
        <span class="Estilo11">Si</span>
        <input type="radio" name="penfermedad" value="N" disabled="true"  <%if penfermedad="" then%> style="background-color:#CC0000 " <%end if%> <% if penfermedad="N" then%> checked <% else %> unchecked  <% end if %> onClick="enfermedad.disabled=true" > 
        <span class="Estilo11">No</span></td>
      <td  align="center"  ><input type="text" size="25" name="enfermedad" id="enfermedad"  maxlength="50" class="txt" value="<%response.Write(enfermedad)%>"  <% if enfermedad=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> /></td>
      <td align="center"  ><input type="radio" name="palergia" disabled="true" value="S" <%if palergia="" then%> style="background-color:#CC0000 " <%end if%> <% if palergia="S" then%> checked <% else %> unchecked  <% end if %> onClick="alergia.disabled=false" />
        <span class="Estilo11">Si</span>
        <input type="radio" name="palergia" disabled="true" value="N" <%if palergia="" then%> style="background-color:#CC0000 " <%end if%> <% if palergia="N" then%> checked <% else %> unchecked  <% end if %> onClick="alergia.disabled=true" />
        <span class="Estilo11">No</span></td>
      <td align="center"   ><input type="text" name="alergia"  id="alergia" size="25"  maxlength="150"  class="txt" value="<%response.Write(alergia)%>"   <% if alergia=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
    </tr>
       	  <tr align="center">
      <td  align="left" scope="row">Tipo de Casa</td>
      <td align="center" scope="row">En caso de emergencia contactar a:</td>
      <td  align="center" scope="row"> Parentesco       <span class="Estilo11"></span></td>
      <td  align="center" scope="row"><span class="Estilo11">
        <label for="snombre">Tel&eacute;fono</label></span></td>
    </tr>
    <tr>    <% 
	   if vtcasa="P" then 
	   vtcasa="Propia" 
       elseif vtcasa="A" then 
	   vtcasa="Alquilada"  
       elseif vtcasa="F" then 
	   vtcasa="Familiar" 
       elseif vtcasa="Am" then 
	   vtcasa="Amortiza" 
       elseif vtcasa="O" then 
	   vtcasa="Otros"
	   end if %>
      <td align="left" >  <input type="text" name="tipo_casa"  class="txt" readonly="readonly"   size="20" maxlength="15" value="<%response.write(vtcasa)%>"  <% if vtcasa=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> ></td>
      <td  align="center"  ><input type="text" name="contacto_emer"  readonly="readonly" id="contacto_emer" size="25"  maxlength="50"  class="txt" value="<%response.Write(contacto_emer)%>"  <% if contacto_emer=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
        <%
		   'Dim Conp,qry, objp
		   Set Conp = Server.CreateObject("ADODB.Connection")
		   Conp.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
		   qry = "SELECT * FROM tbl_Parentesco where cod_parentesco='" & parentesco_cont & "'"
	 	   Set RelaFam = Server.CreateObject ("ADODB.RecordSet")
		   RelaFam.Open qry, Conp
		   If (RelaFam.EOF =false) then
		        	contemerg=RelaFam.fields("descripcion")
		   end if
		   Conp.Close
		   set RelaFam= nothing
		   set Conp = nothing
		   
       %>
	  <td align="center"  ><input type="text" name="pcontacto" id="label21"  class="txt" readonly="readonly"  size="25" maxlength="8" value=<%response.write(contemerg)%>  <% if contemerg=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>></td>
      <td align="center"   ><input type="text" name="tel_contacto"  id="tel_contacto" size="25"  maxlength="150" readonly="readonly" class="txt" value="<%response.Write(tel_contacto)%>"  <% if tel_contacto=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>  /></td>
    </tr>
  </table>


<table width="90%"   align="center" border="0" >
<tr>
    <th width="165" height="27" align="left" scope="row"><span class="Estilo11">Practica Deporte:</span> </th>
    <td width="537"  align="left">
<input type="radio" name="deporte" value="S" disabled="true" <%if vpd="" then%> style="background-color:#CC0000 " <%end if%> <% if vpd="S" then%> checked <% else %> unchecked  <% end if %> onclick="catdeporte.disabled=false;" />
<span class="Estilo11">Si</span>
      <input type="radio" name="deporte" disabled="true" value="N" <%if vpd="" then%> style="background-color:#CC0000 " <%end if%> <% if vpd="N" then%> checked 
	       <% else %> unchecked  <% end if %> onClick="catdeporte.disabled=true;">      
      <span class="Estilo11">No</span></td>
  </tr>
 <% if vpd="S" then%>
  <tr>
    <td height="27" colspan="2" ><span class="Estilo11">Disciplina deportiva:</span>
  </tr>
  <tr> </tr>
 
  <td height="27" colspan="2"><table align="center" width="35%"  border="1" bordercolor="#333333">
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
 <%end if%>
   <tr>
    <th width="165" height="35" align="left" scope="row"><span class="Estilo11">Tiene Tarjeta de Cr&eacute;dito: </span> </th>
    <td colspan="3" align="left">
<input type="radio" name="tarjeta" disabled="true"  value="S" <%if vtc="" then%> style="background-color:#CC0000 " <%end if%> <% if vtc="S" then%> checked 
	       <% else %> unchecked  <% end if %> onclick="bancos.disabled=false" />      
<span class="Estilo11">Si</span>
      <input type="radio" name="tarjeta" value="N" disabled="true" <%if vtc="" then%> style="background-color:#CC0000 " <%end if%> <% if vtc="N" then%> checked 
	       <% else %> unchecked  <% end if %> onClick="bancos.disabled=true">
      <span class="Estilo11">No</span></td>
  </tr>
   <%if vtc="S" then%>
   <tr>
    <td height="27"  colspan="2" ><span class="Estilo11">Instituci&oacute;n bancaria 
        
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
  <%end if%>
</table> 


 <table width="90%"   align="center" border="0" height="25"bgcolor="#CCCCCC" >
 <tr align="center">
	   <th align="left">DATOS DE FAMILIARES </td>
       <td width="114" align="right"> </td>
  	</tr>
   
</table> 

 
 <table align="center" width="90%" border=1 cellspacing=1 cellpadding=1 bordercolor="#333333">
    <tr>
      <td width="8%" align="center" valign="middle" class="Estilo11">Parentesco</td>
      <td width="10%" align="center" valign="middle"><span class="Estilo11">Nombres</span ></td>
      <td width="9%" align="center" valign="middle"><span class="Estilo11">Apellidos</span ></td>
      <td width="9%" align="center" valign="middle"><span class="Estilo11">Fecha Nacimiento</span ></td>
      <td width="5%" align="center" valign="middle"><span class="Estilo11">Dep.</span ></td>
	  <td width="11%" align="center" valign="middle"><span class="Estilo11">Ocupacion</span ></td>
	   <td width="11%" align="center" valign="middle"><span class="Estilo11">Lugar de Trabajo</span ></td>
      <td width="43%" align="center" valign="middle"><span class="Estilo11">Domicilio</span ></td>
	      
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
	  cadena=cadena & "</tr>"
	   
      Response.Write(cadena)
      objDF.MoveNext
   wend
   
   Conn.Close
   set objRS = nothing
   set Conn = nothing
   
%>
 </table>
<br></br>
 


  <table width="90%"   align="center" border="0" height="25" bgcolor="#CCCCCC">
 <tr align="center">
	   <th  align="left"> DATOS ACADEMICOS  </th>
	   <td width="114" align="right"><a href="#dfamiliares"> </td>
  	</tr>
   
</table> 
 
  <table width="90%"   align="center" border="1"   bordercolor="#333333">
  <tr> 
    <td  align="center" valign="middle"><span class="Estilo11">Nivel Acad&eacute;mico</span></td>
	<td  align="center" valign="middle"><span class="Estilo11">T&iacute;tulo Obtenido</span></td>
    <td   align="center" valign="middle"><span class="Estilo11">Instituci&oacute;n Educativa</span></td>
		<td  align="center" valign="middle"><span class="Estilo11">Estado </span> </td>
	<td   align="center" valign="middle"><span class="Estilo11"> &Uacute;ltimo a&ntilde;o aprobado</span> </td>
   <td width="8%" scope="col" align="center" valign="middle"><span class="Estilo11">Duracion </span> </td>
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
   contador=0
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nivela") & "</span ></td><td><span class=""Estilo12"">" & objDF("titulo") & "</span ></td>"
	  cadena=cadena &"<td><span class=""Estilo12"">" & objDF("institucion") & "</span ></td><td><span class=""Estilo12"">" & objDF("estado1") & "</span ></td>"
	  cadena=cadena & "<td><span class=""Estilo12"">" & objDF("ult_ano_aprob") & "</span ></td>" & "<td><span class=""Estilo12"">" & objDF("duracion") & "</span ></td>"
	  cadena=cadena & "</tr>"
      Response.Write(cadena)
      contador=contador+1
	  objDF.MoveNext
   wend
  Conn.Close
   set objRS = nothing
   set Conn = nothing
    if contador=0 then
     response.Write("<tr><td bgcolor=""#CC0000"" colspan=""6"" align=""center""><span class=""Estilo10"">SIN REGISTRO</span></td></tr>")
   end if
%>
 </table>
 <table width="90%"   align="center" border="0" height="35" >
 <tr align="center">
	   <th  align="left"> CONOCIMIENTO DE IDIIOMAS  </th>
	   <td width="114" align="right"></td>
  	</tr>
   
</table> 
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
   contador=0
   Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  idiomas=objDF("descripcion")
	  nlectura=objDF("nivel_lectura")
	  nescritura=objDF("nivel_lectura")
	  nconversacion=objDF("nivel_lectura")
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td><td align=""center""><span class=""Estilo12"">" & objDF("nivel_lectura") & "</span ></td>"
	  cadena=cadena &"<td align=""center""><span class=""Estilo12"">" & objDF("nivel_escritura") & "</span ></td><td align=""center""><span class=""Estilo12"">" & objDF("nivel_conversacion") & "</span ></td></tr>"
	  Response.Write(cadena)
	  contador=contador+1
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
     if contador=0 then
     response.Write("<tr><td bgcolor=""#CC0000"" colspan=""4"" align=""center""><span class=""Estilo10"">SIN REGISTRO</span></td></tr>")
   end if
%>
 
</table>		
		
 
 
</table>
			
  
  
<br></br>
  <table width="90%"   align="center" border="0" height="25" bgcolor="#CCCCCC">
 <tr align="center">
	   <th align="left" > EXPERIENCIA LABORAL Y/O PASANTIAS</th>
	    <td width="114" align="right">    </td>
  	</tr>
 
</table> 

<%       'DIM NOMBRES
   dim  contexp, experiencia, id,empresa_ep,puesto_ep,direccion_ep,telefono_ep,area_ep,salario_ep,jefe_ep,finicio_ep,ffin_ep, estado_ep
   Set Conn = Server.CreateObject("ADODB.Connection")
   contexp=0
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
	 contexp=1
	 %>  
	     
   <table width="90%"   align="center" border="0"   bordercolor="#333333">
     <tr> </tr>
     <tr>
       <th colspan="6" align="left">Empleo Actual</th>
     </tr>
     <tr>
       <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
       <td colspan="3" ><input type="text" name="ep_empresa_act"   readonly="readonly" class="txt" size="60" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
       <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
       <td ><input type="text" name="ep_puesto_act"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
     </tr>
     <tr>
       <th width="88" scope="row" align="left">Area</th>
       <td colspan="3" >
         <input type="text" name="ep_area_act" readonly="readonly" class="txt"  border="0"    size="60" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
       <th width="102" scope="row" align="left">Tel&eacute;fono</th>
       <td ><input type="text" name="ep_telefono_act" id="ep_telefono_act" class="txt" border="0"   readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/></td>
     </tr>
     <tr>
       <th width="88" scope="row" align="left"><span class="Estilo15">Direcci&oacute;n</span></th>
       <td colspan="5"><input type="text" name="ep_direccion_act" readonly="readonly" border="0"  class="txt"  size="126" maxlength="150"  value="<%response.Write(direccion_ep)%>"/></td>
     </tr>
     <tr>
       <th width="88" scope="row" align="left">Salario</th>
       <td colspan="3" ><input type="text" name="ep_salario_act" readonly="readonly" class="txt" border="0"  size="50" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
       <th width="102" scope="row" align="left">Jefe Inmediato</th>
       <td ><input type="text" name="ep_jefe_act"  class="txt" border="0"  size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/>
       </td>
     </tr>
     <tr>
       <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
       <th width="93"><input type="text" name="ep_finicio_act"  id="ep_finicio_act2" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" border="0"  /></th>
       <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span></th>
       <th width="88"><span class="Estilo15">
       <input type="text" name="ep_ffin22" id= "ep_ffin222" size="12" readonly="readonly"value= "<%response.Write(ffin_ep & "N/A")%>" maxlength="12"  class="txt" border="0" />
</span></th>
       <th width="102" align="left" scope="row">&nbsp;</th>
     </tr>
   </table>
   <%  
   'Response.Write(cadena)
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
	 contexp=1
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
  %>  
	     
   <table width="90%"   align="center" border="0"   bordercolor="#333333">
  <tr> 
    <tr>
      <th colspan="6" align="left">Ultimo Empleo</th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_ult"   readonly="readonly" class="txt" size="60" maxlength="150" value= "<%response.Write(empresa_u)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_ult"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_u)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_ult" readonly="readonly" class="txt"     size="60" maxlength="150" value= "<%response.Write(area_u)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
      <td ><input type="text" name="ep_telefono_ult" id="ep_telefono_ult"   class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_u)%>"/>
      </td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5"><input type="text" name="ep_direccion_ult" readonly="readonly" class="txt"  size="126" maxlength="150"  value="<%response.Write(direccion_u)%>"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_ult" readonly="readonly" class="txt"  size="60" maxlength="150" value= "<%response.Write(salario_u)%>"/></td>
      <th width="102" scope="row" align="left">Jefe Inmediato</th>
      <td><input type="text" name="ep_jefe_ult"  class="txt" size="42" maxlength="150"  value="<%response.Write(jefe_u)%>" readonly="readonly"/></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_ult"  id="ep_finicio_ult2" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span></th>
      <th width="88"><span class="Estilo15">
        <input type="text" name="ep_ffin_ult" id= "ep_ffin_ult2" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
     
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
	 contexp=1
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
  %>  
	     
  <table width="90%"   align="center" border="0"   bordercolor="#333333">
  <tr> 
    <tr>
	   <th colspan="6" align="left">Pen&uacute;ltimo Empleo </th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_pen"   readonly="readonly" class="txt"  size="60" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_pen"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_pen" readonly="readonly" class="txt"     size="60" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
       <td ><input type="text" name="ep_telefono_pen"  class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/> 
       </td>

    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5">        <input type="text" name="ep_direccion_pen" readonly="readonly" class="txt"  size="124" maxlength="150"  value="<%response.Write(direccion_ep)%>"/>
      </td>
    </tr>
     <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_pen" readonly="readonly" class="txt"  size="60" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
       <th width="102" scope="row" align="left">Jefe Inmediato<span class="Estilo15"></th>
       <td ><input type="text" name="ep_jefe_pen"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/> 
       </td>

    </tr>
	<tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_pen"  id="ep_finicio_pen" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span></th>
      <th width="88"><span class="Estilo15">
      <input type="text" name="ep_ffin_pen" id= "ep_ffin_pen2" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th>
      <th width="102" align="left" scope="row">&nbsp;</th>
    
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
	 contexp=1
	 cadena="<td> <a href=""javascript:ventana('eprofesional.asp?id= "& objDF("id_ep")&"')"" ><span class=""Estilo12"">Editar</span ></a></td>"
	 %>  
	  <table width="90%"   align="center" border="0"   bordercolor="#333333">
  <tr> 
    <tr>
	   <th colspan="6" align="left">Antepen&uacute;ltimo Empleo </th>
    </tr>
    <tr>
      <th width="88" scope="row" align="left"><span class="Estilo11"> Empresa</span></th>
      <td colspan="3" ><input type="text" name="ep_empresa_pen2"   readonly="readonly" class="txt"  size="60" maxlength="150" value= "<%response.Write(empresa_ep)%>"/></td>
      <th width="102" scope="row" align="left"><span class="Estilo11"> Puesto</span></th>
      <td ><input type="text" name="ep_puesto_pen"  class="txt" readonly="readonly"  onkeypress="return Valida_Dato(event,6)" size="42" maxlength="150" value="<%response.Write(puesto_ep)%>" /></td>
    </tr>
    <tr>
      <th width="88" scope="row" align="left">Area</th>
      <td colspan="3" ><input type="text" name="ep_area_pen" readonly="readonly" class="txt"     size="60" maxlength="150" value= "<%response.Write(area_ep)%>"/></td>
      <th width="102" scope="row" align="left">Tel&eacute;fono</th>
       <td ><input type="text" name="ep_telefono_pen"  class="txt"  readonly="readonly" size="42" maxlength="50" value= "<%response.Write(telefono_ep)%>"/> 
       </td>

    </tr>
    <tr>
      <th width="88" scope="row" align="left">Direcci&oacute;n</th>
      <td colspan="5">        <input type="text" name="ep_direccion_pen" readonly="readonly" class="txt"  size="124" maxlength="150"  value="<%response.Write(direccion_ep)%>"/>
      </td>
    </tr>
     <tr>
      <th width="88" scope="row" align="left">Salario</th>
      <td colspan="3" ><input type="text" name="ep_salario_pen" readonly="readonly" class="txt"  size="60" maxlength="150" value= "<%response.Write(salario_ep)%>"/></td>
       <th width="102" scope="row" align="left">Jefe Inmediato<span class="Estilo15"></th>
       <td ><input type="text" name="ep_jefe_pen"  class="txt" size="42" maxlength="150" readonly="readonly" value= "<%response.Write(jefe_ep)%>"/> 
       </td>

    </tr>
	<tr>
      <th width="88" scope="row" align="left"><span class="Estilo11">Fecha Inicio: (mm/yyyy) </span></th>
      <th width="93"><input type="text" name="ep_finicio_pen"  id="ep_finicio_pen" readonly="readonly" size="12"  value= "<%response.Write(mmi&"/"&yyi)%>" maxlength="12"  class="txt" /></th>
      <th width="93"><span class="Estilo11">Fecha Fin : (mm/yyyy) </span></th>
      <th width="88"><span class="Estilo15">
      <input type="text" name="ep_ffin_pen" id= "ep_ffin_pen2" size="12" readonly="readonly"value= "<%response.Write(mmf&"/"&yyf)%>" maxlength="12"  class="txt" />
      </span></th></tr>
  </table>   

  <%'  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
%>	
<%
  if contexp=0 then
     response.Write("<table table width=""720"" align=""center"" border=""0"" ><tr><td bgcolor=""#cc0000"" colspan=""6"" align=""center""><span class=""Estilo10"">SIN REGISTRO</span></td></tr></table>")
   end if
   %>		
  <br></br>            

<table width="90%"   align="center" border="0"  >
 <tr align="center">
	   <th align="left" > PUESTO QUE SOLICITA</th>
	      <td width="114" align="right"> </td>
  	</tr>
 
</table> 

<table width="90%"   align="center" border="0" >
  <tr>
    <td width="201" scope="row" align="left"><span class="Estilo11"> Puesto al que Aplica</span><span class="Estilo15">*</span></td>
    <td colspan="3"><input type="text" name="puesto" id="puesto" readonly="readonly" class="txt"  size="90" maxlength="150"  value="<%response.Write(cargo)%>"  <% if cargo=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
  </tr>
  <tr>
    <td width="201" scope="row" align="left">Aspiraci&oacute;n Salarial:<span class="Estilo15">*</span></td>
    <td width="104"><input type="text" name="salario_max" readonly="readonly"  class="txt" size="12" maxlength="50" value="<%response.Write(salario_max)%>"  <% if salario_max=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%>/></td>
    <td width="217" align="right" scope="row"><span class="Estilo11">Acepto  M&iacute;nimo:</span><span class="Estilo15">*</span></td>
    <td width="180"><input type="text" name="salario_min"  class="txt" size="12" maxlength="150" readonly="readonly" value="<%response.Write(salario_min)%>"  <% if salario_min=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> /></td>
  </tr>
  <tr>
    <td width="201" scope="row" align="left">Acepta Horario en turno Rotativo:<span class="Estilo15">*</span></td>
    <td width="104"><input type="radio" name="turno" value="S" disabled="true" <%if vturno="" then%> style="background-color:#CC0000 " <%end if%> <% if vturno="S" then%> checked <% else %> unchecked  <% end if %>/>
        <span class="Estilo11">Si</span>
        <input type="radio" name="turno" value="N" disabled="true" <%if vturno="" then%> style="background-color:#CC0000 " <%end if%> <% if vturno="N" then%> checked <% else %> unchecked  <% end if %> />
        <span class="Estilo11">No</span></td>
    <td width="217" align="right" scope="row"><span class="Estilo11">Tiene alg&uacute;n compromiso de horario:</span><span class="Estilo15">*</span></td>
    <td width="180"><input type="text" name="obs_horario"  class="txt"  size="35" maxlength="150" readonly="readonly"  <% if obs_horario=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> value="<%response.Write(obs_horario)%>"/></td>
  </tr>
  <tr>
    <td width="201" scope="row" align="left"><span class="Estilo11">Resuma su Experiencia Laboral</span><span class="Estilo15"></span></td>
    <td colspan="3"><textarea name="experiencia" cols="120"  rows="8" id="experiencia"  <% if experiencia=""  then %> style="background-color:#CC0000; border: 1px solid #666666; color:#FF0000"  <% end if%> readonly="readonly" onkeypress="return Valida_Dato(event,4)"> <%response.write(experiencia)%> </textarea></td>
  </tr>
</table>

  <table width="90%"   align="center" border="0"  >
 <tr align="center" bgcolor="#CCCCCC" height="25" >
	   <th height="25" align="left" >REFERENCIAS</th>
	   <td height="25" width="114" align="right"></td>
  	</tr>
	<tr align="center">
	<th colspan="2" align="left"> Tres referencias de personas que lo conozcan hace m&aacute;s de 3 a&ntilde;os. Ninguna relaci&oacute;n familiar. (Pueden ser vecinos, amigos o conocidos)</th>
 </tr>
</table> 





 <table  width="90%"   align="center" border="1" bordercolor="#333333">
              <tr>
                <td width="186" scope="col"><span class="Estilo11">Nombre Completo</span></td>
                <td width="158" scope="col">Direcci&oacute;n</td>
                <td width="101" scope="col"><span class="Estilo11">Empresa </span></td>
                <td width="61" scope="col"><span class="Estilo11"> Edad </span></td>
                <td width="61" scope="col"><span class="Estilo11"> Tel&eacute;fono</span></td>
    			<td width="61" scope="col"><span class="Estilo11"> Parentesco</span></td>
				
              </tr>
          <%       'DIM NOMBRES
   
   Set Conn = Server.CreateObject("ADODB.Connection")

   Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
  strSQL= "SELECT COUNT(*) from tbl_referencias a, tbl_parentesco b where a.tipo_relacion=b.cod_parentesco and interno='N' AND cedula='"& Session("cedula") &"'"
  contador=0
  strSQL = "select a.*, b.descripcion from tbl_referencias a, tbl_parentesco b where a.tipo_relacion=b.cod_parentesco and interno='N' AND cedula='"& Session("cedula") &"'"
   Set objDF = Conn.Execute(strSQL)
    total= objDF.Recordcount 
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nombre_Completo") & "</span ></td><td ><span class=""Estilo12"">" & objDF("direccion") & "</span ></td>"
	  cadena=cadena &"<td ><span class=""Estilo12"">" & objDF("empresa") & "</span ></td><td ><span class=""Estilo12"">" & objDF("edad") & "</span ></td>"
	  cadena=cadena & "<td ><span class=""Estilo12"">" & objDF("telefono") & "</span ></td>" & "<td ><span class=""Estilo12"">" & objDF("descripcion") & "</span ></td>"
	  cadena=cadena & " </tr>"
	  Response.Write(cadena)
	  contador=contador+1
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
 
   if contador=0 then
     response.Write("<tr><td bgcolor=""#cc0000"" colspan=""6"" align=""center""><span class=""Estilo10"">SIN REGISTRO</span></td></tr>")
   end if
   %>		
    
		  
  </table>  
  <br>
  </br>
  <table width="90%"   align="center" border="0"  >

	<tr align="center">
	<th colspan="2" align="left">Personas que lo conozcan que actualmente laboren para esta empresa.</th>
 </tr>
</table> 			
<table width="90%"   align="center" border="1" bordercolor="#333333">
              <tr>
                <td width="391" scope="col"><span class="Estilo11">Nombre Completo</span></th>
                <td width="116" scope="col">Edad</td>
                <td width="156" scope="col"><span class="Estilo11">Telefono</span></td>
				
              </tr>
<%       'DIM NOMBRES
  Set Conn = Server.CreateObject("ADODB.Connection")
  Conn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
  strSQL = "select * from tbl_referencias where interno='Y' and cedula='"& Session("cedula") &"'"
  contador=0
  Set objDF = Conn.Execute(strSQL)
      while (not objDF.Eof)
	  cadena="<tr><td><span class=""Estilo12"">" & objDF("nombre_Completo") & "</span ></td>"
	  cadena=cadena &"<td ><span class=""Estilo12"">" & objDF("edad") & "</span ></td>"
	  cadena=cadena & "<td ><span class=""Estilo12"">" & objDF("telefono") & "</span ></td>" 
	  cadena=cadena & " </tr>"
	  contador=contador+1
	  Response.Write(cadena)
	  objDF.MoveNext
   wend
   Conn.Close
   set objRS = nothing
   set Conn = nothing
 if contador=0 then
     response.Write("<tr><td bgcolor=""#cc0000"" colspan=""6"" align=""center""><span class=""Estilo10"">SIN REGISTRO</span></td></tr>")
   end if
   %>				 
</table>  

  <table width="90%"   align="center" border="0" height="60" >
 <tr align="center">
    <th width="134" align="right" >Fecha:</th>
	   <td width="191" align="left"><%response.Write(fecsol)%></td>
	   <th width="159" align="right" >Firma del Solicitante:</th>
	   <td width="218" align="left">_________________________</td>
  	</tr>
	
</table> 
<p>
  <center>
    <input type="submit" name="Accion"  class="btn2"  value="Salir" onclick="acciones.value='Salir'" />
  </center>
  </p>
</form >	
</body>
</html>
<%
if Request.ServerVariables("REQUEST_METHOD") = "POST" then
Dim Accion,sqlstring
Accion = Request.Form("Acciones")
If accion="Salir" then
 	Session.Abandon
 	Session.Contents.RemoveAll()
 	Response.Redirect("index.asp")
End if
 
end if
%>