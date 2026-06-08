export interface Municipio {
  id: string;
  nombre: string;
}

export interface Departamento {
  id: string;
  nombre: string;
  municipios: Municipio[];
}

export const departamentos: Departamento[] = [
  {
    id: 'BO', nombre: 'Boaco', municipios: [
      { id: 'BO-01', nombre: 'Boaco' },
      { id: 'BO-02', nombre: 'Camoapa' },
      { id: 'BO-03', nombre: 'San José de los Remates' },
      { id: 'BO-04', nombre: 'San Lorenzo' },
      { id: 'BO-05', nombre: 'Santa Lucía' },
      { id: 'BO-06', nombre: 'Teustepe' },
    ]
  },
  {
    id: 'CA', nombre: 'Carazo', municipios: [
      { id: 'CA-01', nombre: 'Diriamba' },
      { id: 'CA-02', nombre: 'Dolores' },
      { id: 'CA-03', nombre: 'El Rosario' },
      { id: 'CA-04', nombre: 'Jinotepe' },
      { id: 'CA-05', nombre: 'La Conquista' },
      { id: 'CA-06', nombre: 'La Paz de Carazo' },
      { id: 'CA-07', nombre: 'San Marcos' },
      { id: 'CA-08', nombre: 'Santa Teresa' },
    ]
  },
  {
    id: 'CI', nombre: 'Chinandega', municipios: [
      { id: 'CI-01', nombre: 'Chichigalpa' },
      { id: 'CI-02', nombre: 'Chinandega' },
      { id: 'CI-03', nombre: 'Cinco Pinos' },
      { id: 'CI-04', nombre: 'Corinto' },
      { id: 'CI-05', nombre: 'El Realejo' },
      { id: 'CI-06', nombre: 'El Viejo' },
      { id: 'CI-07', nombre: 'Posoltega' },
      { id: 'CI-08', nombre: 'Puerto Morazán' },
      { id: 'CI-09', nombre: 'San Francisco del Norte' },
      { id: 'CI-10', nombre: 'San Pedro del Norte' },
      { id: 'CI-11', nombre: 'Santo Tomás del Norte' },
      { id: 'CI-12', nombre: 'Somotillo' },
      { id: 'CI-13', nombre: 'Villanueva' },
    ]
  },
  {
    id: 'CH', nombre: 'Chontales', municipios: [
      { id: 'CH-01', nombre: 'Acoyapa' },
      { id: 'CH-02', nombre: 'Comalapa' },
      { id: 'CH-03', nombre: 'Cuapa' },
      { id: 'CH-04', nombre: 'El Coral' },
      { id: 'CH-05', nombre: 'Juigalpa' },
      { id: 'CH-06', nombre: 'La Libertad' },
      { id: 'CH-07', nombre: 'San Francisco de Cuapa' },
      { id: 'CH-08', nombre: 'San Pedro de Lóvago' },
      { id: 'CH-09', nombre: 'Santo Domingo' },
      { id: 'CH-10', nombre: 'Santo Tomás' },
      { id: 'CH-11', nombre: 'Villa Sandino' },
    ]
  },
  {
    id: 'RA', nombre: 'Costa Caribe Norte', municipios: [
      { id: 'RA-01', nombre: 'Bonanza' },
      { id: 'RA-02', nombre: 'Mulukukú' },
      { id: 'RA-03', nombre: 'Prinzapolka' },
      { id: 'RA-04', nombre: 'Puerto Cabezas' },
      { id: 'RA-05', nombre: 'Rosita' },
      { id: 'RA-06', nombre: 'Siuna' },
      { id: 'RA-08', nombre: 'Waslala' },
      { id: 'RA-07', nombre: 'Waspán' },
    ]
  },
  {
    id: 'AS', nombre: 'Costa Caribe Sur', municipios: [
      { id: 'AS-01', nombre: 'Bluefields' },
      { id: 'AS-02', nombre: 'Corn Island' },
      { id: 'AS-03', nombre: 'Desembocadura de Río Grande' },
      { id: 'AS-04', nombre: 'El Ayote' },
      { id: 'AS-05', nombre: 'El Rama' },
      { id: 'AS-06', nombre: 'El Tortuguero' },
      { id: 'AS-07', nombre: 'Kukra Hill' },
      { id: 'AS-08', nombre: 'La Cruz de Río Grande' },
      { id: 'AS-09', nombre: 'Laguna de Perlas' },
      { id: 'AS-10', nombre: 'Muelle de los Bueyes' },
      { id: 'AS-11', nombre: 'Nueva Guinea' },
      { id: 'AS-12', nombre: 'Paiwas' },
    ]
  },
  {
    id: 'ES', nombre: 'Estelí', municipios: [
      { id: 'ES-01', nombre: 'Condega' },
      { id: 'ES-02', nombre: 'Estelí' },
      { id: 'ES-03', nombre: 'La Trinidad' },
      { id: 'ES-04', nombre: 'Pueblo Nuevo' },
      { id: 'ES-05', nombre: 'San Juan de Limay' },
    ]
  },
  {
    id: 'GR', nombre: 'Granada', municipios: [
      { id: 'GR-02', nombre: 'Diriomo' },
      { id: 'GR-01', nombre: 'Diriá' },
      { id: 'GR-03', nombre: 'Granada' },
      { id: 'GR-04', nombre: 'Nandaime' },
    ]
  },
  {
    id: 'JI', nombre: 'Jinotega', municipios: [
      { id: 'JI-01', nombre: 'El Cuá' },
      { id: 'JI-02', nombre: 'Jinotega' },
      { id: 'JI-03', nombre: 'La Concordia' },
      { id: 'JI-04', nombre: 'San Rafael del Norte' },
      { id: 'JI-05', nombre: 'San Sebastián de Yalí' },
      { id: 'JI-06', nombre: 'Santa María de Pantasma' },
      { id: 'JI-07', nombre: 'Wiwilí de Jinotega' },
    ]
  },
  {
    id: 'LE', nombre: 'León', municipios: [
      { id: 'LE-01', nombre: 'Achuapa' },
      { id: 'LE-02', nombre: 'El Jicaral' },
      { id: 'LE-03', nombre: 'El Sauce' },
      { id: 'LE-04', nombre: 'La Paz Centro' },
      { id: 'LE-05', nombre: 'Larreynaga' },
      { id: 'LE-06', nombre: 'León' },
      { id: 'LE-07', nombre: 'Nagarote' },
      { id: 'LE-08', nombre: 'Quezalguaque' },
      { id: 'LE-09', nombre: 'Santa Rosa del Peñón' },
      { id: 'LE-10', nombre: 'Telica' },
    ]
  },
  {
    id: 'MD', nombre: 'Madriz', municipios: [
      { id: 'MD-01', nombre: 'Las Sabanas' },
      { id: 'MD-02', nombre: 'Palacagüina' },
      { id: 'MD-03', nombre: 'San José de Cusmapa' },
      { id: 'MD-04', nombre: 'San Juan de Río Coco' },
      { id: 'MD-05', nombre: 'San Lucas' },
      { id: 'MD-06', nombre: 'Somoto' },
      { id: 'MD-07', nombre: 'Telpaneca' },
      { id: 'MD-08', nombre: 'Totogalpa' },
      { id: 'MD-09', nombre: 'Yalagüina' },
    ]
  },
  {
    id: 'MN', nombre: 'Managua', municipios: [
      { id: 'MN-01', nombre: 'Ciudad Sandino' },
      { id: 'MN-02', nombre: 'El Crucero' },
      { id: 'MN-03', nombre: 'Managua' },
      { id: 'MN-04', nombre: 'Mateare' },
      { id: 'MN-05', nombre: 'San Francisco Libre' },
      { id: 'MN-06', nombre: 'San Rafael del Sur' },
      { id: 'MN-07', nombre: 'Ticuantepe' },
      { id: 'MN-08', nombre: 'Tipitapa' },
      { id: 'MN-09', nombre: 'Villa Carlos Fonseca' },
    ]
  },
  {
    id: 'MS', nombre: 'Masaya', municipios: [
      { id: 'MS-01', nombre: 'Catarina' },
      { id: 'MS-02', nombre: 'La Concepción' },
      { id: 'MS-03', nombre: 'Masatepe' },
      { id: 'MS-04', nombre: 'Masaya' },
      { id: 'MS-05', nombre: 'Nandasmo' },
      { id: 'MS-06', nombre: 'Nindirí' },
      { id: 'MS-07', nombre: 'Niquinohomo' },
      { id: 'MS-08', nombre: 'San Juan de Oriente' },
      { id: 'MS-09', nombre: 'Tisma' },
    ]
  },
  {
    id: 'MT', nombre: 'Matagalpa', municipios: [
      { id: 'MT-01', nombre: 'Ciudad Darío' },
      { id: 'MT-02', nombre: 'El Tuma-La Dalia' },
      { id: 'MT-03', nombre: 'Esquipulas' },
      { id: 'MT-04', nombre: 'Matagalpa' },
      { id: 'MT-05', nombre: 'Matiguás' },
      { id: 'MT-06', nombre: 'Muy Muy' },
      { id: 'MT-07', nombre: 'Rancho Grande' },
      { id: 'MT-08', nombre: 'Río Blanco' },
      { id: 'MT-09', nombre: 'San Dionisio' },
      { id: 'MT-10', nombre: 'San Isidro' },
      { id: 'MT-11', nombre: 'San Ramón' },
      { id: 'MT-12', nombre: 'Sébaco' },
      { id: 'MT-13', nombre: 'Terrabona' },
      { id: 'MT-14', nombre: 'Waslala' },
    ]
  },
  {
    id: 'NS', nombre: 'Nueva Segovia', municipios: [
      { id: 'NS-01', nombre: 'Ciudad Antigua' },
      { id: 'NS-02', nombre: 'Dipilto' },
      { id: 'NS-03', nombre: 'El Jícaro' },
      { id: 'NS-04', nombre: 'Jalapa' },
      { id: 'NS-05', nombre: 'Macuelizo' },
      { id: 'NS-06', nombre: 'Mozonte' },
      { id: 'NS-07', nombre: 'Murra' },
      { id: 'NS-08', nombre: 'Ocotal' },
      { id: 'NS-09', nombre: 'Quilalí' },
      { id: 'NS-10', nombre: 'San Fernando' },
      { id: 'NS-11', nombre: 'Santa María' },
      { id: 'NS-12', nombre: 'Wiwilí de Nueva Segovia' },
    ]
  },
  {
    id: 'RI', nombre: 'Rivas', municipios: [
      { id: 'RI-01', nombre: 'Altagracia' },
      { id: 'RI-02', nombre: 'Belén' },
      { id: 'RI-03', nombre: 'Buenos Aires' },
      { id: 'RI-04', nombre: 'Cárdenas' },
      { id: 'RI-05', nombre: 'Moyogalpa' },
      { id: 'RI-06', nombre: 'Potosí' },
      { id: 'RI-07', nombre: 'Rivas' },
      { id: 'RI-08', nombre: 'San Jorge' },
      { id: 'RI-09', nombre: 'San Juan del Sur' },
      { id: 'RI-10', nombre: 'Tola' },
    ]
  },
  {
    id: 'RS', nombre: 'Río San Juan', municipios: [
      { id: 'RS-01', nombre: 'El Almendro' },
      { id: 'RS-02', nombre: 'El Castillo' },
      { id: 'RS-03', nombre: 'Morrito' },
      { id: 'RS-04', nombre: 'San Carlos' },
      { id: 'RS-05', nombre: 'San Juan de Nicaragua' },
      { id: 'RS-06', nombre: 'San Miguelito' },
    ]
  },
];

export function getMunicipios(departamentoId: string): Municipio[] {
  const dep = departamentos.find(d => d.id === departamentoId);
  return dep?.municipios || [];
}
