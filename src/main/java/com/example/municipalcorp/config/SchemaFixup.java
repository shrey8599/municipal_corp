package com.example.municipalcorp.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Widens Region image columns from VARCHAR(255) to MEDIUMTEXT at startup.
 *
 * Why this is needed:
 *   ddl-auto=update adds new columns but NEVER alters existing column types.
 *   The 'region' table was created with mla_image_url/cm_image_url/pm_image_url
 *   as VARCHAR(255). Base64-compressed images (~15–25 KB) overflow VARCHAR(255).
 *
 * Why ApplicationReadyEvent (not @PostConstruct or CommandLineRunner):
 *   ApplicationReadyEvent fires AFTER Hibernate DDL update completes, so if this
 *   is a fresh DB the 'region' table already exists by the time we run.
 *
 * Idempotent: checks INFORMATION_SCHEMA before altering — skips the ALTER TABLE
 * if the column is already MEDIUMTEXT or larger. Safe to run on every startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SchemaFixup {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void widenRegionImageColumns() {
        String[] cols = {"mla_image_url", "cm_image_url", "pm_image_url"};
        for (String col : cols) {
            try {
                String dataType = jdbcTemplate.queryForObject(
                    "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS " +
                    "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'region' AND COLUMN_NAME = ?",
                    String.class, col
                );
                if ("varchar".equalsIgnoreCase(dataType)) {
                    jdbcTemplate.execute("ALTER TABLE region MODIFY COLUMN `" + col + "` MEDIUMTEXT");
                    log.info("SchemaFixup: widened region.{} to MEDIUMTEXT", col);
                } else {
                    log.debug("SchemaFixup: region.{} is already {} — no change needed", col, dataType);
                }
            } catch (Exception e) {
                log.warn("SchemaFixup: could not check/widen region.{}: {}", col, e.getMessage());
            }
        }
    }
}
