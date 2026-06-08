<%
'Comprobar que está autorizado
IF IsEmpty(session("cedula")) then
'No está autorizado
response.redirect "index.asp"
end if
%>

<script language=JavaScript >

function recarga_padre_y_cierra_ventana(){
window.opener.location.reload();
window.close();
opener.document.location="solicitud.asp#dacademicos"
}

</script>
<% 
Dim Accion
Accion = Request("grabar_da")
dim id
id=request.querystring("id")
Dim oConn,strSQL
   	Set oConn = Server.CreateObject("ADODB.Connection")
   	oConn.Open"driver={SQL Server};server=192.168.8.234; database=Sol_Empleo; uid=Reclutamiento;pwd=sel3Rh2011"
   	codigo=Request.Form("cedula")
   
 if accion="Actualizar" then
 	   	if 	Request.Form("nacad" )<>"" and Request.Form("titulo") <> "" and Request.Form("estado" )<>"" And Request.Form("institucion" )<>"" then
			strSQL="update  tbl_dacademicos set nivel_academico='" &Request.Form("nacad" ) & "', titulo='" & Request.Form("titulo") &  "',"
			strSQL= strSQL &  "estado='"  & Request.Form("estado" ) &"', ult_ano_aprob='" & Request.Form("anoaprob" ) & "',"
			strSQL= strSQL & "institucion='"  & Request.Form("institucion" )& "'," & "duracion='" & Request.Form("duracion") & "'"
			strSQL= strSQL & "from tbl_dacademicos where id_da='"& id & "'"
			'response.write(strSQL)
			oConn.Execute(strSQL)
			oConn.Close
			set oConn = nothing
		end if   
elseif accion="Eliminar" then
  strSQL="delete from tbl_dacademicos where id_da='" & id & "'"
  'response.write(strSQL) 
  oConn.Execute(strSQL)
   oConn.Close
   set oConn = nothing
end if%>
<body>
<body onLoad="recarga_padre_y_cierra_ventana()">

</body>
