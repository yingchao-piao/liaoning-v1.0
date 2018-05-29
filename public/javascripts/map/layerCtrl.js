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

map.on('click', function(evt) {

    //点击地图关联查询属性域表返回相关feature信息(json形式)
    var url = mapModule.xbm_wms_layer.getSource().getGetFeatureInfoUrl(
        evt.coordinate, viewResolution, viewProjection,
        {'INFO_FORMAT': 'application/json'});
    if(url){
        var featureInfo = {};

        var parser = new ol.format.GeoJSON();
        $.ajax({
            url: url,
            dataType: 'json',
            jsonCallback: 'response'
        }).then(function(response) {
            var result = parser.readFeatures(response);
            if (result.length) {
                for (var i = 0, ii = result.length; i < ii; ++i) {
                    for(var key in result[i].values_){
                        if(result[i].values_[key] && key!="geometry"){
                            featureInfo[key] = result[i].values_[key];
                        }
                    }
                }

            }

            $.ajax({
                type: 'POST',
                url: '/liaoningResource/getfeatureinfo',
                traditional:true,
                data: JSON.stringify(featureInfo),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (response) {
                    //返回对象数组
                    //{field:***，domain_name:***}(domain_name可能为null),
                    //{description：***，code:***}(如果根据编码没有查到属性值，则该元素不存在)
                    for(var i = 0; i < response.length; i++){
                        if(response[i].hasOwnProperty("field")){
                            if(response[i].domain_name){
                                if(response[i+1].hasOwnProperty("descriptio")){
                                    featureInfo[response[i].field]=response[i+1].descriptio;
                                    i++;
                                }
                            }
                        }
                    }

                    //构建GetfeatureInfo dataTable
                    var data = [];
                    var columnTitle = [];

                    for(var key in featureInfo){
                        columnTitle.push({"title": key});
                        data.push(featureInfo[key]) ;
                    };
                    if(data.length){
                        data = [data];
                        $(document).ready(function() {
                            $('#featureInfo').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="featureInfoTable"></table>' );
                            $('#featureInfoTable').dataTable( {
                                "data": data,
                                "columns": columnTitle,
                                "scrollX": true
                            } );
                        } );
                    } else {
                        $(document).ready(function() {
                            $('#featureInfo').html( '<p>No feature selected!</p>' );
                        } );
                    }

                }

            });

        });

    }

});
