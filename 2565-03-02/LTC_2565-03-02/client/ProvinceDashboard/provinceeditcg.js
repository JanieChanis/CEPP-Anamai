
import { UploadFS } from 'meteor/jalik:ufs';
import { GridFSStore } from 'meteor/jalik:ufs-gridfs';

const proEditCG = new GridFSStore({
    collection: Photos,
    name: 'proEditCG',
    chunkSize: 1024 * 255,
    filter: new UploadFS.Filter({
        contentTypes: ['image/*'],
        extensions: ['jpg', 'png']
    }),
    path: '/uploads/photos'
});
Template.provinceeditcg.onCreated(function init() {

    $('body').addClass('waitMe_body');
    var elem = $('<div class="waitMe_container img"><div style="background:url(\'img.svg\')"></div></div>');
    $('body').prepend(elem);
})
Template.provinceeditcg.onRendered(function () {
    Session.set('getEditedZoneCGbyHOSPCODE', "")
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    $("#birthDate").datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        yearStart: 1800,
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });
    $("#trainingDate").datetimepicker({
        timepicker: false,
        format: 'd/m/Y', // กำหนดรูปแบบวันที่ ที่ใช้ เป็น 00-00-0000
        lang: 'th', // แสดงภาษาไทย
        mask: true,
        yearStart: 1800,
        onChangeMonth: thaiYear,
        onShow: thaiYear,
        yearOffset: 543, // ใช้ปี พ.ศ. บวก 543 เพิ่มเข้าไปในปี ค.ศ
        closeOnDateSelect: true,
    });

    $('#companyName').selectize();
    $('#district_name').selectize();
    $('#subdistrict_name').selectize();
    $('#province_name').selectize();


    if (Session.get('ProvinceEditCGDetail')) {
        Meteor.call('getUserCG', Session.get('ProvinceEditCGDetail'), function (error, result) {
            Session.set('ProvinceGetEditProfileCG', result)
            Session.set("ProvinceEditedImgCG", result[0].IMG)
            $('body.waitMe_body').addClass('hideMe');
            $('body.waitMe_body').find('.waitMe_container:not([data-waitme_id])').remove();
            $('body.waitMe_body').removeClass('waitMe_body hideMe');
        });
    }

});
Template.provinceeditcg.helpers({
    user() {

        if (Session.get('ProvinceGetEditProfileCG')) {

            Meteor.call('getDistrictName', Session.get('ProvinceGetEditProfileCG')[0].TAMBON.CODE, function (error, result) {
                Session.set('districtNameWorkEditedCG', result)
            });
            Meteor.call('getRegProvince_name', function (error, result) {
                $('#province_name')[0].selectize.destroy()
                $('#province_name').selectize({ options: result, create: false });
                var $select = $("#province_name").selectize();
                var selectize = $select[0].selectize;
                selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCG').province_code + "-" + Session.get('districtNameWorkEditedCG').province_name).query);
            });
            var tarindate = new Date(Session.get('ProvinceGetEditProfileCG')[0].TRAINING_DATE);
            Session.set('ProvinceGetExpiredCG', new Date(tarindate.getFullYear() + 2, tarindate.getMonth(), tarindate.getDate()))
            return Session.get('user').PROVINCE
        }
    },
    hosp() {
        if (Session.get('ProvinceHospAddCGEdited')) {
            return Session.get('ProvinceHospAddCGEdited');
        }
    },
    profile() {
        if (Session.get('ProvinceGetEditProfileCG')) {
            return Session.get('ProvinceGetEditProfileCG')[0]
        }
    },
    showimg() {
        return Session.get('ProvinceEditedImgCG');
    },
    EXPIREDATE() {
        return Session.get('ProvinceGetExpiredCG')
    },
    OldNameWork() {
        if (Session.get('districtNameWorkEditedCG')) {
            var data = Session.get('districtNameWorkEditedCG');
            return data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name
        }
    },

    NewDistricName() {
        if (Session.get('ProvinceNewDistricCG')) {
            return Session.get('ProvinceNewDistricCG')
        }
    },
    radioStatus() {
        if (Session.get('ProvinceGetEditProfileCG')) {
            if (Session.get('ProvinceGetEditProfileCG')[0].HOSPCODE) {
                Session.set('switchCompany', true)
                return { comp: true, dla: false }
            } else {

                Session.set('switchCompany', false)
                return { comp: false, dla: true }
            }
        }
    },
    switchCompany() {
        if (Session.get('ProvinceGetEditProfileCG')) {
            if (Session.get('switchCompany')) {
                if (Session.get('ProvinceGetEditProfileCG')[0].HOSPCODE) {

                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                        var $select = $("#companyName").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('ProvinceGetEditProfileCG')[0].HOSPCODE.CODE).query);
                    });
                    Meteor.call('getDistrictName', Session.get('ProvinceGetEditProfileCG')[0].TAMBON.CODE, function (error, result) {
                        Session.set('ProvinceGetDistricWorkCG', result)

                    });
                    Meteor.call('getRegProvince_name', function (error, result) {
                        $('#province_name')[0].selectize.destroy()
                        $('#province_name').selectize({ options: result, create: false });
                        var $select = $("#province_name").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('ProvinceGetDistricWorkCG').province_code + "-" + Session.get('ProvinceGetDistricWorkCG').province_name).query);
                    });
                    Meteor.call('getAllServiceCenterDistrict', Session.get('ProvinceGetEditProfileCG')[0].HOSPCODE.CODE, function (error, result) {

                        Session.set('ProvinceHospAddCGEdited', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
                    });
                    return true
                } else {
                    Meteor.call('getAllServiceCenter', function (error, result) {
                        $('#companyName')[0].selectize.destroy()
                        $('#companyName').selectize({ options: result, create: false });
                    });
                    return true
                }
            } else {
                Session.set('ProvinceHospAddCGEdited', null);
                if (Session.get('ProvinceGetEditProfileCG')[0].DLACODE) {

                    Meteor.call('getDLA_NAME', Session.get('ProvinceGetEditProfileCG')[0].DLACODE.CODE, function (error, result) {
                        if (result) {
                            //console.log(result.PROVINCE)
                            // Session.set('getProvinceByDLA', result.PROVINCE);
                            Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                                Session.set('getZoneByDLA', result);
                            })
                        }

                    });
                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                        var $select = $("#dla").selectize();
                        var selectize = $select[0].selectize;
                        selectize.setValue(selectize.search(Session.get('ProvinceGetEditProfileCG')[0].DLACODE.CODE).query);
                    });
                    return false
                } else {
                    Meteor.call('getAllDLA_CODE', function (error, result) {
                        $('#dla')[0].selectize.destroy()
                        $('#dla').selectize({ options: result, create: false });
                    });
                }
            }
        }
    },
});
Template.provinceeditcg.events({
    "change #subdistrict_name"() {
        var res = $('#subdistrict_name').val().split("-")
        Meteor.call('getDistrictName', res[0], function (error, data) {
            Session.set('ProvinceNewDistricCG', data.fullcode + " ต." + data.subdistrict_name + " อ." + data.district_name + " จ." + data.province_name)
        });
    },
    "change #trainingDate"() {
        var tdateString = $("#trainingDate").val().split("/");
        var tdate = new Date(parseInt(tdateString[2] - 539), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
        Session.set('ProvinceGetExpiredCG', tdate)
    },
    "change #district_name"() {
        var res = $('#district_name').val().split('-')
        Meteor.call('getRegSubsistrict_name', res[0], function (error, result) {
            $('#subdistrict_name')[0].selectize.destroy()
            $('#subdistrict_name').selectize({ options: result, create: false });
            var $select = $("#subdistrict_name").selectize();
            var selectize = $select[0].selectize;
            selectize.setValue(selectize.search(Session.get('districtNameWorkEditedCG').fullcode + "-" + Session.get('districtNameWorkEditedCG').subdistrict_name).query);

        });
    },
    "change #province_name"() {
        var res = $('#province_name').val().split('-')
        Meteor.call('getRegDistrict_name', res[0], function (error, result) {
            $('#district_name')[0].selectize.destroy()
            $('#district_name').selectize({ options: result, create: false });
            var $select1 = $("#district_name").selectize();
            var selectize1 = $select1[0].selectize;
            selectize1.setValue(selectize1.search(Session.get('districtNameWorkEditedCG').district_code + "-" + Session.get('districtNameWorkEditedCG').district_name).query);

        });
    },
    "change #companyName"() {
        Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (error, result) {
            if (result) {
                Session.set('getEditedZoneCGbyHOSPCODE', result)
                Session.set('ProvinceHospAddCGEdited', result.address + " หมู่ " + result.moo + " ต." + result.district.split('-')[1] + " อ." + result.amphoe.split('-')[1] + " จ." + result.province.split('-')[1] + " เขต " + result.zone)
            }
        });
    },
    "change #dla"(event) {
        Meteor.call('getDLA_NAME', $('#dla').val(), function (error, result) {
            if (result) {
                Meteor.call('getZoneByDLA', result.PROVINCE, function (error, result) {
                    Session.set('getZoneByDLA', result);
                })
            }

        });

    },
    "click  #radio_company"() {
        Session.set('switchCompany', true)
        Session.set('getZoneByDLA', "")

    },
    "click  #radio_dla"() {
        Session.set('switchCompany', false)
        Session.set('ProvinceHospAddCGEdited', "");
        Session.set('getEditedZoneCGbyHOSPCODE', "")

    },
    "click #save"() {
        if ($("#TRAININGHOURS").val() && $('#province_name') && $('#district_name') && $('#subdistrict_name') && $("#pid").val() && $("#titleName").val() && $("#FName").val() && $("#LName").val() && $("#sex").val() && $("#tel").val() && $("#email").val() && $("#trainingBy").val() && $("#birthDate").val() && $("#trainingDate").val()) {
            var bdateString = $("#birthDate").val().split("/");
            var bdate = new Date(parseInt(bdateString[2] - 543), parseInt(bdateString[1] - 1), parseInt(bdateString[0]), 0, 0, 0, 0)
            var tdateString = $("#trainingDate").val().split("/");
            var tdate = new Date(parseInt(tdateString[2] - 543), parseInt(tdateString[1] - 1), parseInt(tdateString[0]), 0, 0, 0, 0)
            var data = Session.get('getEditedZoneCGbyHOSPCODE');
            if (data) {
                Meteor.call('getAllServiceCenterDistrict', $('#companyName').val(), function (err, res) {
                    CG_REGISTER.update({
                        "_id": Session.get('ProvinceGetEditProfileCG')[0]._id
                    }, {
                            $set: {
                                PRENAME: $("#titleName").val(),
                                NAME: $("#FName").val(),
                                LNAME: $("#LName").val(),
                                SEX: $("#sex").val(),
                                BIRTH: bdate,
                                MOBILE: $("#tel").val(),
                                EMAIL: $("#email").val(),
                                HOSPCODE: {
                                    CODE: $("#companyName").val(),
                                    NAME: res.name,
                                    DISTRICT: res.district,
                                    AMPHOE: res.amphoe,
                                    PROVINCE: res.province
                                },
                                DLACODE: null,
                                TRAINING_DATE: tdate,
                                EXPIREDATE: Session.get('ProvinceGetExpiredCG'),
                                TRAINING_CENTER_ID: $("#trainingBy").val(),
                                IMG: Session.get('ProvinceEditedImgCG'),
                                STATE_ACTIVE: $("#stateActive").val(),
                                ADDRESS: $("#address").val(),
                                TAMBON: {
                                    CODE: $("#subdistrict_name").val().split('-')[0],
                                    DISTRICT: $('#subdistrict_name').val().split('-')[1],
                                    AMPHOE_CODE: $('#district_name').val().split('-')[0],
                                    AMPHOE: $('#district_name').val().split('-')[1],
                                    PROVINCE_CODE: $('#province_name').val().split('-')[0],
                                    PROVINCE: $('#province_name').val().split('-')[1]
                                },
                                PROVIDERTYPE: $("#persontype").val(),
                                TRAININGHOUR: $("#TRAININGHOURS").val(),
                                POSITIONCODE: $("#POSITIONCODE").val(),
                                EDUCATION: $('#education').val(),
                                zone: data.zone,
                                D_UPDATE: new Date()

                            }
                    });
                    toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                    setTimeout(() => {
                        Session.set("ProvinceEditedImgCG", null)
                    }, 500);
                    Router.go("/provinceViewCG")
                });
            } else {
                Meteor.call('getDLA_NAME', $('#dla').val(), function (err, res) {
                    CG_REGISTER.update({
                        "_id": Session.get('ProvinceGetEditProfileCG')[0]._id
                    }, {
                            $set: {
                                PRENAME: $("#titleName").val(),
                                NAME: $("#FName").val(),
                                LNAME: $("#LName").val(),
                                SEX: $("#sex").val(),
                                BIRTH: bdate,
                                MOBILE: $("#tel").val(),
                                EMAIL: $("#email").val(),
                                HOSPCODE: null,
                                DLACODE: {
                                    CODE: $('#dla').val(),
                                    NAME: res.DLA_NAME,
                                    DISTRICT: res.DISTRICT,
                                    PROVINCE: res.PROVINCE
                                },
                                TRAINING_DATE: tdate,
                                EXPIREDATE: Session.get('ProvinceGetExpiredCG'),
                                TRAINING_CENTER_ID: $("#trainingBy").val(),
                                IMG: Session.get('ProvinceEditedImgCG'),
                                STATE_ACTIVE: $("#stateActive").val(),
                                ADDRESS: $("#address").val(),
                                TAMBON: {
                                    CODE: $("#subdistrict_name").val().split('-')[0],
                                    DISTRICT: $('#subdistrict_name').val().split('-')[1],
                                    AMPHOE_CODE: $('#district_name').val().split('-')[0],
                                    AMPHOE: $('#district_name').val().split('-')[1],
                                    PROVINCE_CODE: $('#province_name').val().split('-')[0],
                                    PROVINCE: $('#province_name').val().split('-')[1]
                                },
                                PROVIDERTYPE: $("#persontype").val(),
                                TRAININGHOUR: $("#TRAININGHOURS").val(),
                                POSITIONCODE: $("#POSITIONCODE").val(),
                                EDUCATION: $('#education').val(),
                                zone: Session.get('getZoneByDLA'),
                                D_UPDATE: new Date(),

                            }
                    });
                    toastr.success("อัพเดทข้อมูลส่วนตัวเรียบร้อย", "สำเร็จ");
                    setTimeout(() => {
                        Session.set("ProvinceEditedImgCG", null)
                    }, 500);
                    Router.go("/provinceViewCG")
                });
            }

        } else {
            toastr.error("กรอกข้อมูลไม่ครบ ตรวจสอบใหม่อีกครั้ง", "พบข้อผิดพลาด");
        }

    },
    'click button[name=upload]'(ev) {
        Photos.remove({ _id: Session.get("removephotoEditCG") })
        UploadFS.selectFiles(function (file) {
            let photo = {
                name: file.name,
                size: file.size,
                type: file.type,
            };
            let uploader = new UploadFS.Uploader({
                store: proEditCG || 'proEditCG',
                adaptive: true,
                capacity: 0.8,
                chunkSize: 8 * 1024,
                maxChunkSize: 128 * 1024,
                maxTries: 5,
                data: file,
                file: photo,
                onError(err, file) {
                    if (err) {
                        console.log(err)
                        alert("ไฟล์รูปเท่านั้น")
                    } else {
                        // console.log(file)
                    }
                },
                onAbort(file) {
                    // console.log(file.name + ' upload has been aborted');
                },
                onComplete(file) {
                    // console.log(file.name + ' has been uploaded ' + file.url);
                    var urlpic = "http://ltc.anamai.moph.go.th" + (file.url).split('http://10.100.1.26:80')[1]
                    Session.set("ProvinceEditedImgCG", file.url)
                },
                onCreate(file) {
                    // console.log(file.name + ' has been created with ID ' + file._id);
                    Session.set("removephotoEditCG", file._id);
                },
                onProgress(file, progress) {
                    // console.log(file.name + ' ' + (progress * 100) + '% uploaded');

                },
                onStart(file) {
                    // console.log(file.name + ' started');
                    Session.set("ProvinceEditedImgCG", "InternetSlowdown_Day.gif")
                },
                onStop(file) {
                    // console.log(file.name + ' stopped');
                },
            });
            uploader.start();
        });
    }
});