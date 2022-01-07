// models 안에 파일이 추가되면 sequelize는 이 파일을 읽어서 테이블과 컬럼을 생성함
// MySQL의 create문을 대신한다고 생각하면 됨
module.exports = function(sequelize, DataTypes){
    // sequelize를 이용해서 Product라는 이름을 가진 table 생성
    const product = sequelize.define('Product', {
        // column 생성
        name: {
            type: DataTypes.STRING(20),
            // NOT NULL 설정
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        seller: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    });
    return product;
}