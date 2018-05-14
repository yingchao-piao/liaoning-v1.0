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
        bingaerial:'bingaerial',
        xbm:'J2210000JB2006XBM_utf8'
    }
};

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

//构建地图模块，设置相关属性
var mapModule = {
    baseMap: new ol.layer.Tile({
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AttVbOas-R25-sOVvUkfWipFTx7ryIlHJh0ryn7O9Q07h8a-XpFf0DSY0qtH6whp',
            imagerySet: 'AerialWithLabels'
        })
    }),
    xbm_wms_layer: new ol.layer.Tile({
        source: mapLayerSource.baseLayerSource.xbm_wms_source
    }),
    defaultView:new ol.View({
        projection: 'EPSG:4326',
        center: [122.312,41.096],
        zoom:7
    })
};

var map = new ol.Map({
    target: 'map',
    layers: [mapModule.baseMap, mapModule.xbm_wms_layer],
    view: mapModule.defaultView
});