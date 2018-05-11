/**
 * Created layerCtrl.js
 * Author: piaopiao
 * Date: 2018/5/9
 * Time: 14:38
 * Description: OpenLayer加载Geoserver发布的图层
*/

var geoserverUrl = 'http://localhost:8080/geoserver/';

//geoserver发布的工作空间、图层的名称
var layersAttr = {
    workspace:'liaoning',
    layerNames:{
        xbm:'J2210000JB2006XBM_utf8'
    }
};

var styles = [
    'Road',
    'RoadOnDemand',
    'Aerial',
    'AerialWithLabels',
    'collinsBart',
    'ordnanceSurvey'
];
var layers = [];
var i, ii;
for (i = 0, ii = styles.length; i < ii; ++i) {
    layers.push(new ol.layer.Tile({
        visible: false,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AttVbOas-R25-sOVvUkfWipFTx7ryIlHJh0ryn7O9Q07h8a-XpFf0DSY0qtH6whp',
            imagerySet: styles[i]
        })
    }));
}

//openlayers各图层source
var mapLayerSource={
    baseLayerSource:{
        xbm_wms_source:new ol.source.TileWMS({
            url:geoserverUrl+layersAttr.workspace+'/wms',
            params:{
                'LAYERS':layersAttr.workspace+':'+layersAttr.layerNames.xbm,
                'TILED':true
            },
            serverType:'geoserver',
            crossOrigin:'anonymous'
        })
    }
};

//构建mapModule对象，先初始化图层的相关属性
var mapModule = {
    xbm_wms_layer: new ol.layer.Tile({
        source: mapLayerSource.baseLayerSource.xbm_wms_source
    }),
    defaultView:new ol.View({
        center: ol.proj.transform([122.312,41.096], 'EPSG:4326', 'EPSG:3857'),
        zoom:6.5
    })
};

layers.push(mapModule.xbm_wms_layer);

var map = new ol.Map({
    target: 'map',
    layers: layers,
    loadTilesWhileInteracting: true,
    view: mapModule.defaultView
});