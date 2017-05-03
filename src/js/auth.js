angular.module('SER.auth', []);

angular.module('SER.auth').value('userPermissions', []);
angular.module('SER.auth').value('isSuperuser', false);
angular.module('SER.auth').value('url403', '');

angular.module('SER.auth').service('permissionService', [
    'userPermissions',
    'isSuperuser',
    function (userPermissions, isSuperuser) {
        
        return {
            hasPermission: function (requiredPermission) {

                if (isSuperuser) {
                    return true;
                }

                if (notValue(requiredPermission)) {
                    return false;
                }

                return userPermissions.indexOf(requiredPermission) !== -1;
            },
            atLeastPermissions: function (requiredPermissions) {

                if (isSuperuser) {
                    return true;
                }

                if (hasValue(requiredPermissions)) {

                    for (var index = 0; index < requiredPermissions.length; index++) {

                        if (inArray(requiredPermissions[index], userPermissions)) {
                            return true;
                        }
                    }

                    return false;
                }

                return true;
            },
            hasPermissions: function (requiredPermissions) {

                if (isSuperuser) {
                    return true;
                }

                for (var index = 0; index < requiredPermissions.length; index++) {

                    if (notInArray(requiredPermissions[index], userPermissions)) {
                        return false;
                    }
                }

                return true;
            }
        }

    }
]);