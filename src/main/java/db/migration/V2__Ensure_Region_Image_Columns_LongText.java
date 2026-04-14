package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.ResultSet;
import java.sql.Statement;

/**
 * Flyway V2 migration: ensures region image URL columns are LONGTEXT.
 *
 * Why a Java migration (not SQL):
 *   - On a FRESH database Flyway runs BEFORE Hibernate's ddl-auto creates the 'region' table.
 *     The migration checks for table existence and skips the ALTER if the table isn't there yet;
 *     Hibernate will then create it with the correct LONGTEXT type from the entity definition.
 *   - On an EXISTING Railway database the 'region' table already has VARCHAR(255) columns
 *     (Hibernate's ddl-auto=update never changes existing column types). The ALTER statements
 *     convert those columns to LONGTEXT so that base64 image data (~15-25 KB) can be stored.
 *
 * canExecuteInTransaction=false: MySQL auto-commits DDL statements; wrapping them in an
 * explicit transaction would cause an implicit commit anyway, so we just disable it.
 */
public class V2__Ensure_Region_Image_Columns_LongText extends BaseJavaMigration {

    @Override
    public boolean canExecuteInTransaction() {
        return false; // DDL in MySQL implicitly commits
    }

    @Override
    public void migrate(Context context) throws Exception {
        try (Statement stmt = context.getConnection().createStatement()) {

            // Only alter if the 'region' table already exists.
            // On a fresh DB the table doesn't exist yet; Hibernate will create it with LONGTEXT.
            ResultSet rs = stmt.executeQuery(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'region'"
            );
            rs.next();
            boolean tableExists = rs.getInt(1) > 0;
            rs.close();

            if (!tableExists) {
                // Nothing to alter; Hibernate (ddl-auto=update) will create the table
                // with @Column(columnDefinition = "LONGTEXT") on the entity fields.
                return;
            }

            stmt.execute("ALTER TABLE region MODIFY COLUMN mla_image_url LONGTEXT");
            stmt.execute("ALTER TABLE region MODIFY COLUMN cm_image_url LONGTEXT");
            stmt.execute("ALTER TABLE region MODIFY COLUMN pm_image_url LONGTEXT");
        }
    }
}
