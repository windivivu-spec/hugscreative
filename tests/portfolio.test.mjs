import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { projects, getVideoPreview } from "../data/projects.ts";
import { services, homepageServices } from "../data/services.ts";
import { serviceVisuals } from "../data/service-visuals.ts";
import {
  sortProjects,
  groupProjectsByYear,
  featuredProjects,
  archiveHref,
} from "../data/portfolio.ts";

test("every portfolio entry has a unique detail slug and available local media", () => {
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  for (const p of projects) {
    assert.match(p.id, /^[a-z0-9-]+$/);
    assert.ok(!["archive", "social-media"].includes(p.id));
    assert.ok(
      services.some((s) => s.title === p.category),
      p.id,
    );
    assert.ok(p.year === "" || /^\d{4}$/.test(p.year), p.id);
    const assets = [
      p.image,
      ...p.gallery,
      ...(p.videos ?? []).flatMap((v) => [v.src, v.poster, getVideoPreview(v)]),
    ].filter(Boolean);
    for (const asset of assets)
      assert.ok(
        existsSync(
          new URL(`../public${decodeURIComponent(asset)}`, import.meta.url),
        ),
        `${p.id}: ${asset}`,
      );
  }
});

test("all six service chapters have four distinct featured projects and working archive destinations", () => {
  assert.equal(services.length, 6);
  for (const s of services) {
    const selected = featuredProjects(s.title);
    assert.equal(selected.length, 4, s.title);
    assert.equal(new Set(selected.map((p) => p.id)).size, 4);
    assert.ok(
      selected.every((p) => projects.includes(p) && p.category === s.title),
    );
    assert.equal(s.workHref, `/work#${s.slug}`);
    assert.equal(
      archiveHref(s.slug, "2026"),
      `/work/archive?service=${s.slug}&year=2026`,
    );
  }
});

test("years group newest first, keep undated work last, and preserve editorial ties without mutating data", () => {
  const input = [
    { ...projects[0], id: "older", year: "2024" },
    { ...projects[0], id: "undated", year: "" },
    { ...projects[0], id: "newer", year: "2027" },
    { ...projects[0], id: "same-year", year: "2027" },
  ];
  assert.deepEqual(
    sortProjects(input).map((p) => p.id),
    ["newer", "same-year", "older", "undated"],
  );
  assert.deepEqual(
    groupProjectsByYear(input).map((g) => [g.year, g.projects.length]),
    [
      ["2027", 2],
      ["2024", 1],
      ["Undated", 1],
    ],
  );
  assert.equal(input[0].id, "older");
  assert.equal(archiveHref(), "/work/archive");
});

test("every service image and video belongs to the project linked from its viewer", () => {
  assert.equal(serviceVisuals.length, homepageServices.length);
  serviceVisuals.forEach((visuals, index) => {
    assert.ok(visuals.length > 0);
    for (const visual of visuals) {
      const project = projects.find((item) => item.id === visual.projectId);
      assert.ok(project, visual.projectId);
      assert.equal(project.name, visual.projectName);
      assert.equal(project.category, homepageServices[index].title);
      assert.ok(
        [
          project.image,
          ...project.gallery,
          ...(project.videos ?? []).map((v) => v.poster),
        ].includes(visual.image),
        `${visual.image} must belong to ${project.id}`,
      );
      if (visual.preview) {
        assert.ok(
          project.videos?.some((v) => getVideoPreview(v) === visual.preview),
          `${visual.preview} must play on ${project.id}`,
        );
      }
    }
  });
});

test("owner-supplied graphic projects retain their confirmed years and grouped galleries", () => {
  for (const [id, year] of [
    ["kem-trang-tien", "2026"],
    ["vinamilk", "2026"],
    ["yen-thien-viet", "2024"],
  ]) {
    const project = projects.find((p) => p.id === id);
    assert.ok(project, id);
    assert.equal(project.year, year);
    assert.equal(project.contentStatus, "supplied");
    assert.ok(project.gallery.length >= 2);
    assert.ok(project.overview.length > 80);
  }
  assert.ok(
    groupProjectsByYear(projects).some((group) => group.year === "2024"),
  );
});
