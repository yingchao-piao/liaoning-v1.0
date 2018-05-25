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
    //Bing在线底图
    baseMap: new ol.layer.Tile({
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AttVbOas-R25-sOVvUkfWipFTx7ryIlHJh0ryn7O9Q07h8a-XpFf0DSY0qtH6whp',
            imagerySet: 'AerialWithLabels'
        })
    }),

    //林相图
    xbm_wms_layer: new ol.layer.Tile({
        source: mapLayerSource.baseLayerSource.xbm_wms_source
    }),

    //默认的图层显示样式
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

//点击地图查看相关feature信息
var viewProjection = mapModule.defaultView.getProjection();
var viewResolution = mapModule.defaultView.getResolution();
var container = document.getElementById('info');

map.on('click', function(evt) {
    //点击地图查看相关feature信息(返回html形式)
    // var url = mapModule.xbm_wms_layer.getSource().getGetFeatureInfoUrl(
    //     evt.coordinate, viewResolution, viewProjection,
    //     {'INFO_FORMAT': 'text/html'});
    // if (url) {
    //     $.ajax({
    //         url: url,
    //         dataType: "html",
    //         success: function (data) {
    //             $('#info').html(data);
    //         },
    //         error: function (e) {
    //             alert('Error: ' + e);
    //         }
    //     });
    // }
    //点击地图查看相关feature信息(返回json形式)
    // var url = mapModule.xbm_wms_layer.getSource().getGetFeatureInfoUrl(
    //     evt.coordinate, viewResolution, viewProjection,
    //     {'INFO_FORMAT': 'application/json',
    //      'propertyName': 'OBJECTID,C_XIAN,C_XIANG,C_CUN,C_LB,C_XB,C_TFH,C_SHUIXI,C_STFQ,C_SZZC,C_SZZCHZ'
    //     });
    // if(url){
    //     var parser = new ol.format.GeoJSON();
    //     $.ajax({
    //         url: url,
    //         dataType: 'json',
    //         jsonCallback: 'response'
    //     }).then(function(response) {
    //         var result = parser.readFeatures(response);
    //         if (result.length) {
    //             var info = [];
    //             for (var i = 0, ii = result.length; i < ii; ++i) {
    //                 info.push(Object.keys(result[i].values_));
    //                 info.push(Object.values(result[i].values_));
    //                 info.push(result[i].get('OBJECTID'));
    //                 info.push(result[i].get('C_XIAN'));
    //                 info.push(result[i].get('C_XIANG'));
    //                 info.push(result[i].get('C_CUN'));
    //                 info.push(result[i].get('C_LB'));
    //                 info.push(result[i].get('C_XB'));
    //                 info.push(result[i].get('C_TFH'));
    //                 info.push(result[i].get('C_SHUIXI'));
    //                 info.push(result[i].get('C_STFQ'));
    //                 info.push(result[i].get('C_SZZC'));
    //                 info.push(result[i].get('C_SZZCHZ'));
    //             }
    //             container.innerHTML += "<p>";
    //             container.innerHTML += info[0].join(', ');
    //             container.innerHTML += "</p>";
    //             container.innerHTML += "<p>";
    //             container.innerHTML += info[1].join(', ');
    //             container.innerHTML += "</p>";
    //         } else {
    //             container.innerHTML = '&nbsp;';
    //         }
    //     });
    // }
    //点击地图关联查询属性域表返回相关feature信息(json形式)
    var url = mapModule.xbm_wms_layer.getSource().getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, viewProjection,
        {'INFO_FORMAT': 'application/json',
         'propertyName': 'OBJECTID,C_XIAN,C_XIANG,C_CUN,C_LB,C_XB,C_TFH,C_SHUIXI,C_STFQ,C_SZZC,C_SZZCHZ'
        });
    if(url){
        var featureSearch = {};
        var parser = new ol.format.GeoJSON();
        $.ajax({
            url: url,
            dataType: 'json',
            jsonCallback: 'response'
        }).then(function(response) {
            var result = parser.readFeatures(response);
            if (result.length) {
                for (var i = 0, ii = result.length; i < ii; ++i) {
                    featureSearch = result[i].values_;
                }
            }
            $.ajax({
                type: 'POST',
                url: '/liaoningResource/getfeatureinfo',
                data: JSON.stringify(featureSearch),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (response) {
                    console.log(response);
                }
            });
        });

    }

});
